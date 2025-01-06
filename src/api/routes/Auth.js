/**
 * Author : Andoni ALONSO TORT
 */
const express = require( 'express' );
const AuthService = require( '../services/AuthService' );
const router = express.Router();

router.post( '/login', async ( req, res ) => {
    const { email, password } = req.body;
    try {
        const { user, accessToken, refreshToken } = await AuthService.login( email, password );

        res.status( 200 ).json( {
            user,
            accessToken,
            refreshToken
        } );
    } catch( e ) {
        const status = e?.status || 500;
        const msg = { Error : e?.message || 'Error Server' };

        res.status( status ).json( msg );
    }
} );

router.post( '/token', async ( req, res ) => {
    const refreshToken = req.body.token;

    if( !refreshToken ) {
        return res.sendStatus( 401 );
    }

    if( !await AuthService.refreshTokenExists( refreshToken ) ) {
        return res.sendStatus( 403 );
    }

    AuthService.verifyRefreshToken( refreshToken, ( err, user ) => {
        if( err ) {
            return res.sendStatus( 403 );
        }

        const accessToken = AuthService.generateAccesToken( { firstname : user.firstname } );
        res.json( {
            accessToken
        } );
    } );

} );

router.delete( '/logout', ( req, res ) => {
    const { token } = req.body;

    AuthService.logout( token )
        .then( () => res.sendStatus( 204 ) )
        .catch( () => res.sendStatus( 500 ) );
} );

module.exports = router;