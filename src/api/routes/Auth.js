/**
 * Author : Andoni ALONSO TORT
 */
const express = require( 'express' );
const AuthController = require( '../controllers/AuthController' );
const { authenticateToken } = require( '../middlewares/AuthMiddlewares' );
const router = express.Router();

router.post( '/login', AuthController.login );
router.post( '/token', AuthController.token );
router.delete( '/logout', authenticateToken, AuthController.logout );

module.exports = router;