/**
 * Author : Andoni ALONSO TORT
 */

const express = require( 'express' );
const { authenticateToken, noAuthenticateToken } = require( '../middlewares/AuthMiddlewares' );
const UserController = require( '../controllers/UserController' );
const { isMeOrAdmin } = require( '../middlewares/RightsMiddlewares' );
const router = express.Router();

router.get( '/', authenticateToken, UserController.getAllUsers );
router.post( '/', noAuthenticateToken, UserController.createUser );

router.get( '/:id', authenticateToken, UserController.getUser );
router.put( '/:id', authenticateToken, isMeOrAdmin, UserController.updateUser );
router.delete( '/:id', authenticateToken, isMeOrAdmin, UserController.deleteUser );

module.exports = router;