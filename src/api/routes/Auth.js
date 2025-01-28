/**
 * Author : Andoni ALONSO TORT
 */

const express = require( 'express' );
const AuthController = require( '../controllers/AuthController' );
const router = express.Router();

router.post( '/login', AuthController.login );
router.get( '/token', AuthController.refreshToken );
router.get( '/logout', AuthController.logout );

module.exports = router;