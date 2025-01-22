console.log( '======= TEST USERS DATA =======' );
require( 'dotenv' ).config();
const mongoose = require( 'mongoose' );
const { User } = require( '../../models/User' );
const AuthHelpers = require( '../../helpers/AuthHelpers' );
const UserHelpers = require( '../../helpers/UserHelpers' );

mongoose.connect( process.env.DATABASE_URL + process.env.DATABASE_NAME )
    .then( () => {
        console.log( `== Connected to ${process.env.DATABASE_NAME} ==` );
    } )
    .catch( console.error );

const mongoUsers = [
    new User( {
        firstname: 'admin',
        lastname: 'ADMIN',
        password: 'Admin?123',
        email: 'admin@exemple.com',
        roles: [ 1000, 2000 ]
    } ),
    new User( {
        firstname: 'User1',
        lastname: 'Example',
        password: 'Admin?123',
        email: 'user1@example.com'
    } )
];

mongoUsers.forEach( us => {
    User.where( 'email' ).equals( us.email )
        .then( async ( res ) => {
            if( res.length == 0 ) {
                if( !UserHelpers.verifyPasswordRules( us.password ) ) {
                    throw new Error( UserHelpers.password_rules_message );
                }

                us.password = await AuthHelpers.generateHashPwd( us.password );
                us.save()
                    .then( user => console.log( 'User saved', user ) );
            }
        } )
        .catch( console.error );
} );
