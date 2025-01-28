/**
 * Author : Andoni ALONSO TORT
 */

/** Services / Helpers / Classes */
const UserService = require( '../src/api/services/UserService' );

/** Models */
const { User } = require( '../src/api/models/User' );

/** Libraries */
const { default: mongoose } = require( 'mongoose' );

const restarDatabase = async () => {
    console.log( 'Restart connection to database' );
    await mongoose.connection.dropDatabase(); // Réinitialisez la base pour éviter les conflits
    //mongoose.set( 'debug', true );

    const env = process.env;

    await mongoose.connect( env.DATABASE_URL + env.DATABASE_NAME );
    console.log( `== Connected to ${env.DATABASE_NAME} ==` );
};

const restartData = async initUsers => {
    // Restart data
    await User.deleteMany( {} );
    for( let idx of initUsers.keys() ) {
        initUsers[ idx ] = await UserService.createUser( initUsers[ idx ] );
    }
};

const restartConfig = async initUsers => {
    await restarDatabase();
    await restartData( initUsers );
};

const closeConfig = async() => {
    console.log( '=> Clean Data!' );
    await User.deleteMany( {} );

    console.log( '=> Close connection' );
    await mongoose.connection.db.dropDatabase();
    mongoose.connection.close();
};

module.exports = {
    restartConfig,
    closeConfig
};