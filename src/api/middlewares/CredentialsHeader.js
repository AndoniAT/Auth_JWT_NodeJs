const allowedOrigins = require( '../../config/allowedOrigins' );

const credentials = ( req, res, next ) => {
    const origin = req.headers.origin;
    const isEmpty = allowedOrigins.length == 0;

    if( isEmpty || allowedOrigins.includes( origin ) ) {
        res.header( 'Access-Control-Allow-Credentials', true );
    }

    next();
};

module.exports = credentials;