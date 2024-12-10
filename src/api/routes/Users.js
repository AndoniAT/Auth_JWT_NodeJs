const express = require( 'express' );
const userService = require( '../services/UserService' );

const router = express.Router();

router.get( '/', async ( req, res ) => {
    const users = await userService.getAllUsers();    
    res.json( users );
} );

router.post( '/', async ( req, res ) => {
    const user = req.body;
    const newUser = await userService.createUser( user );
    res.json( newUser );
} );

module.exports = router;