const AuthHelpers = require( '../helpers/AuthHelpers' );

function authenticateToken( req, res, next ) {
    const authHeader = req.headers[ 'authorization' ];
    const token = authHeader && authHeader.split( ' ' )[ 1 ];
    
    if( !token ) {
        return res.sendStatus( 401 );
    }

    AuthHelpers.verifyToken( token, ( err, user ) => {
        if( err ) {
            return res.sendStatus( 403 );
        }

        req.user = user;
        next(); 
    } );
}

module.exports = {
    authenticateToken
};