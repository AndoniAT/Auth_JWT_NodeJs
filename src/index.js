/**
 * Author : Andoni ALONSO TORT
 */

const express = require( 'express' );
require( 'dotenv' ).config();
const path = require( 'path' );
const usersRoute = require( './api/routes/Users.js' );
const authRoute = require( './api/routes/Auth.js' );
const cors = require( 'cors' );
const cookieParser = require( 'cookie-parser' );
const corsOptions = require( './config/corsOptions.js' );
const credentials = require( './api/middlewares/credentials.js' );
const app = express();

/*
== Example for accepting specific origin ==
app.use( cors( {
    origin: 'http://localhost:5174'
    } ) );
    */
   
// Handle options credentials
// and fetch cookies credential requirement
app.use( credentials );

// Cross Origin Resource Sharing
app.use( cors( corsOptions ) );

app.use( express.urlencoded( { extended: true } ) ); // Parse URL-encoded data
app.use( express.json() ); // Parse json for body

// Middleware for cookies
app.use( cookieParser() );


// serve static files
// eslint-disable-next-line no-undef
app.use( '/', express.static( path.join( __dirname, '/public' ) ) );

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 8001;

// APIs
app.use( '/api/users/', usersRoute );
app.use( '/api/auth/', authRoute );

app.listen( PORT, () => {
    console.log( `Application listening in port: ${PORT}` );
} );