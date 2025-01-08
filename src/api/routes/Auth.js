/**
 * Author : Andoni ALONSO TORT
 */
const express = require( 'express' );
const AuthController = require( '../controllers/AuthController' );
//const { authenticateToken } = require( '../middlewares/AuthMiddlewares' );
const router = express.Router();

router.post( '/login', AuthController.login );
router.post( '/token', AuthController.refreshToken );
router.delete( '/logout', AuthController.logout );

module.exports = router;