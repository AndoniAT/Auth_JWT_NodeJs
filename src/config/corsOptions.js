const allowedOrigins = require( './allowedOrigins' );

const corsOptions = {
    origin: ( origin, callback ) => {
        const allowedOriginsEmpty = allowedOrigins.length == 0;

        if( allowedOriginsEmpty || allowedOrigins.indexOf( origin ) !== -1 || !origin ) {
            callback( null, true );
        } else {
            callback( new Error( 'Not allowed by Cors' ) );
        }

    }
};

module.exports = corsOptions;