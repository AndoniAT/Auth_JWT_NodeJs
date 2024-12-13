/**
 * Author : Andoni ALONSO TORT
 */

const express = require( 'express' );
const UserService = require( '../services/UserService' );
const { authenticateToken } = require( '../middlewares/AuthMiddlewares' );
const router = express.Router();

router.get( '/', async ( req, res ) => {
    const users = await UserService.getAllUsers();    
    res.status( 200 ).json( users );
} );

router.get( '/posts', authenticateToken, ( req, res ) => {
    console.log( 'Check user', req.user );
    res.send( 'SUCCESS' );
} );

router.post( '/', async ( req, res ) => {
    const user = req.body;
    const newUser = await UserService.createUser( user );
    res.status( 201 ).json( newUser );
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

module.exports = router;