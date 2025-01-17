console.log( '======= TEST USERS DATA =======' );
require( 'dotenv' ).config();
const mongoose = require( 'mongoose' );
const { User } = require( '../../models/User' );

mongoose.connect( process.env.DATABASE_URL + process.env.DATABASE_NAME )
    .then( () => {
        console.log( `== Connected to ${process.env.DATABASE_NAME} ==` );
    } )
    .catch( console.error );

const mongoUsers = [
    new User( {
        firstname: 'Andoni',
        lastname: 'Alonso Tort',
        password: '$2b$10$u2tk/H6htFHNOgOpC5W7Y.9jZdrW2TfYBlWah31ko5Fjvbp/Kxe6y',
        email: 'andonialonsotort@gmail.com',
        roles: [ 1000 ]
    } ),
    new User( {
        firstname: 'Jean',
        lastname: 'Claude',
        password: '$2b$10$u2tk/H6htFHNOgOpC5W7Y.9jZdrW2TfYBlWah31ko5Fjvbp/Kxe6y',
        email: 'jeanclaude@example.com'
    } )
];

mongoUsers.forEach( us => {
    User.where( 'email' ).equals( us.email )
        .then( res => {
            if( res.length == 0 ) {
                us.save()
                    .then( user => console.log( 'User saved', user ) );
            }
        } );
} );
