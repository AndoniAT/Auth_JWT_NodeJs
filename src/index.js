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
const credentials = require( './api/middlewares/CredentialsHeader.js' );
const mongoose = require( 'mongoose' );
const app = express();

// eslint-disable-next-line no-undef
const env = process.env;

mongoose.connect( env.DATABASE_URL + env.DATABASE_NAME )
    .then( () => {
        console.log( `== Connected to ${env.DATABASE_NAME} ==` );
    } )
    .catch( console.error );
   
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

const PORT = env.PORT || 8001;

// APIs
app.use( '/api/users/', usersRoute );
app.use( '/api/auth/', authRoute );

app.listen( PORT, () => {
    console.log( `Application listening in port: ${PORT}` );
} );