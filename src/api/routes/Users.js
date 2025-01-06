/**
 * Author : Andoni ALONSO TORT
 */

const express = require( 'express' );
const { authenticateToken } = require( '../middlewares/AuthMiddlewares' );
const UserController = require( '../controllers/UserController' );
const router = express.Router();

router.get( '/', authenticateToken, UserController.getAllUsers );
router.post( '/', UserController.createUser );
router.delete( '/:id', authenticateToken, UserController.deleteUser );

/*router.get( '/posts', authenticateToken, ( req, res ) => {
    console.log( 'Check user', req.user );
    res.send( 'SUCCESS' );
} );*/


module.exports = router;