/**
 * Author : Andoni ALONSO TORT
 */

const express = require( 'express' );
const UserService = require( '../services/UserService' );
const { authenticateToken } = require( '../middlewares/UserMiddlewares' );
const router = express.Router();

router.get( '/', async ( req, res ) => {
    const users = await UserService.getAllUsers();    
    res.status( 200 ).json( users );
} );

router.post( '/', async ( req, res ) => {
    const user = req.body;
    const newUser = await UserService.createUser( user );
    res.status( 201 ).json( newUser );
} );

router.delete( '/logout', ( req, res ) => {
    const { token } = req.body;
    UserService.logout( token )
        .then( () => res.sendStatus( 204 ) )
        .catch( () => res.sendStatus( 500 ) );
} );

router.delete( '/:id', async( req, res ) => {
    const { id } = req.params;

    try {
        const deletedUser = await UserService.deleteUser( id );
        res.status( 200 ).json( deletedUser );
    } catch( e ) {
        const status = e?.status || 500;
        const msg = { Error : e?.message || 'Error Server' };

        res.status( status ).json( msg );
    }
} );

router.post( '/login', async ( req, res ) => {
    const { email, password } = req.body;
    try {
        const { user, accessToken, refreshToken } = await UserService.login( email, password );

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

router.get( '/posts', authenticateToken, ( req, res ) => {
    console.log( 'Check user', req.user );
    res.send( 'SUCCESS' );
} );

router.post( '/token', async ( req, res ) => {
    const refreshToken = req.body.token;

    if( !refreshToken ) {
        return res.sendStatus( 401 );
    }

    if( !await UserService.refreshTokenExists( refreshToken ) ) {
        return res.sendStatus( 403 );
    }

    UserService.verifyRefreshToken( refreshToken, ( err, user ) => {
        if( err ) {
            return res.sendStatus( 403 );
        }

        const accessToken = UserService.generateAccesToken( { name : user.name } );
        res.json( {
            accessToken
        } );
    } );

} );

module.exports = router;