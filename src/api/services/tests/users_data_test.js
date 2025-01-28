/**
 * Author : Andoni ALONSO TORT
 */

console.log( '======= TEST USERS DATA =======' );
require( 'dotenv' ).config();
const mongoose = require( 'mongoose' );
const { User } = require( '../../models/User' );
const UserService = require( '../UserService' );

mongoose.connect( process.env.DATABASE_URL + process.env.DATABASE_NAME )
    .then( () => {
        console.log( `== Connected to ${process.env.DATABASE_NAME} ==` );
    } )
    .catch( console.error );

const mongoUsers = [
    new User( {
        username: 'User1',
        firstname: 'admin',
        lastname: 'ADMIN',
        password: 'Admin?123',
        email: 'admin@exemple.com',
        roles: [ 1000, 2000 ]
    } ),
    new User( {
        username: 'User2',
        firstname: 'User 2',
        lastname: 'Example',
        password: 'Admin?123',
        email: 'user2@example.com'
    } )
];

mongoUsers.forEach( async ( us ) => {
    const newUser = await UserService.createUser( us );
    console.log( 'User saved : ', newUser );
} );
