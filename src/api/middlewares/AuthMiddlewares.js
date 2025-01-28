/**
 * Author : Andoni ALONSO TORT
 */

const AuthHelpers = require( '../helpers/AuthHelpers' );
const { Roles } = require( '../models/User' );
const UserService = require( '../services/UserService' );

function authenticateToken( req, res, next ) {
    const authHeader = req.headers[ 'authorization' ];
    const token = authHeader ? authHeader.split( ' ' )[ 1 ] : null;

    if( !token ) {
        return res.sendStatus( 401 );
    }

    AuthHelpers.verifyToken( token, async ( err, decoded_session ) => {
        if( err ) {
            return res.sendStatus( 403 );
        }

        const userSession = decoded_session.user;
        const userFound = await UserService.getUser( userSession.username );

        if( !userFound ) {
            return res.sendStatus( 403 );
        }

        if( userFound ) {
            const emailChanged = ( userFound.email !== userSession.email );
            const usernameChanged = ( userFound.username !== userSession.username );
            if( emailChanged || usernameChanged ) {
                return res.sendStatus( 403 );
            }
        }

        decoded_session.user = {
            ...userSession,
            _id: userFound._id,

            // Set roles of user real data in db
            roles: userFound.roles,
            isAdmin: userFound.roles.includes( Roles.admin )
        };

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