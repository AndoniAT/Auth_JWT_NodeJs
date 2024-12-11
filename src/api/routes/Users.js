/**
 * Author : Andoni ALONSO TORT
 */

const express = require( 'express' );
const userService = require( '../services/UserService' );

const router = express.Router();

router.get( '/', async ( req, res ) => {
    const users = await userService.getAllUsers();    
    res.status( 200 ).json( users );
} );

router.post( '/', async ( req, res ) => {
    const user = req.body;
    const newUser = await userService.createUser( user );
    res.status( 201 ).json( newUser );
} );

router.delete( '/:id', async( req, res ) => {
    const { id } = req.params;

    try {
        const deletedUser = await userService.deleteUser( id );
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
        const user = await userService.login( email, password );
        res.status( 200 ).json( user );
    } catch( e ) {
        const status = e?.status || 500;
        const msg = { Error : e?.message || 'Error Server' };

        res.status( status ).json( msg );
    }
} );

module.exports = router;