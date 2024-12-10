const express = require( 'express' );
const usersRoute = require( './api/routes/Users.js' );
require( 'dotenv' ).config();

const app = express();

app.use( express.json() ); // Parse json for body
app.use( express.urlencoded( { extended: true } ) ); // Parse URL-encoded data

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 8001;

// APIs
app.use( '/api/users/', usersRoute );

app.listen( PORT, () => {
    console.log( `Application listening in port: ${PORT}` );
} );