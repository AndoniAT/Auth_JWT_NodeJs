/**
 * Author : Andoni ALONSO TORT
 */

const express = require( 'express' );
require( 'dotenv' ).config();
const usersRoute = require( './api/routes/Users.js' );
const authRoute = require( './api/routes/Auth.js' );
const cors = require( 'cors' );

const app = express();

/*
== Example for accepting specific origin ==
app.use( cors( {
    origin: 'http://localhost:5174'
    } ) );
    */
   
app.use( cors() );
app.use( express.json() ); // Parse json for body
app.use( express.urlencoded( { extended: true } ) ); // Parse URL-encoded data

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 8001;

// APIs
app.use( '/api/users/', usersRoute );
app.use( '/api/auth/', authRoute );

app.listen( PORT, () => {
    console.log( `Application listening in port: ${PORT}` );
} );