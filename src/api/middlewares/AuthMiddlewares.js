const AuthHelpers = require( '../helpers/AuthHelpers' );
const { Roles } = require( '../models/User' );
const UserService = require( '../services/UserService' );

function authenticateToken( req, res, next ) {
    const authHeader = req.headers[ 'authorization' ];
    const token = authHeader ? authHeader.split( ' ' )[ 1 ] : null;

    if( !token ) {
        return res.sendStatus( 401 );
    }

    AuthHelpers.verifyToken( token, ( err, decoded_session ) => {
        if( err ) {
            return res.sendStatus( 403 );
        }

        decoded_session.user.isAdmin = decoded_session.user.roles.includes( Roles.admin );
        req.session = decoded_session;
        next(); 
    } );
}

async function noAuthenticateToken( req, res, next ) {
    const authHeader = req.headers[ 'authorization' ];
    const token = authHeader ? authHeader.split( ' ' )[ 1 ] : null;

    if( token ) {
        return res.sendStatus( 401 );
    }

    const { jwt } = req.cookies;
    const userFound = await UserService.getUserByRefreshToken( jwt );

    if( userFound ) {
        return res.sendStatus( 401 );
    }

    res.clearCookie( 'jwt', { httpOnly: true, sameSite: 'None', secure: true } );
    next();
}

module.exports = {
    authenticateToken,
    noAuthenticateToken
};