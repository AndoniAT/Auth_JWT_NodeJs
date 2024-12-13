/**
 * Author : Andoni ALONSO TORT
 */

const jwt = require( 'jsonwebtoken' );
const UserController = require( '../controllers/UserController' );
const AuthController = require( '../controllers/AuthController' );
const AuthHelpers = require( '../helpers/AuthHelpers' );

class AuthService {
    // eslint-disable-next-line no-undef
    static #accesTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    // eslint-disable-next-line no-undef
    static #refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    /**
     * Login the user in the application with the email and password
     * @param {string} email 
     * @param {string} password 
     * @returns
     */
    static async login( email, password ) {
        const user = await UserController.getUserByEmail( email );
        if( !user ) {
            const error = new Error( 'Cannot find user' );
            error.status = 400;
            throw error;
        }

        if( await AuthHelpers.comparePasswords( password, user.password ) ) {
            const accessToken = AuthService.generateAccesToken( user );
            const refreshToken = await AuthService.generateRefreshToken( user );

            return {
                user,
                accessToken,
                refreshToken
            };
        } else {
            const error = new Error( 'Bad password' );
            error.status = 400;
            throw error;
        }
    }

    /**
     * 
     * @param {string} token 
     * @returns 
     */
    static logout( token ) {
        return AuthController.removeToken( token );
    }

    /**
     * 
     * @param {string} token 
     * @param {function name( err, user ) {}} cb 
     */
    static verifyToken( token, cb ) {
        jwt.verify( token, this.#accesTokenSecret, cb );
    }

    /**
     * 
     * @param {string} refreshToken 
     * @param {function name( err, user ) {}} cb 
     */
    static verifyRefreshToken( refreshToken, cb ) {
        jwt.verify( refreshToken, this.#refreshTokenSecret, cb );
    }

    /**
     * Sign jwt
     * @param {*} user 
     * @returns {string} the geneated token
     */
    static generateAccesToken( user ) {
        return jwt.sign( user, this.#accesTokenSecret, { expiresIn: '60s' } );
    }

    /**
     * Call fuction in controller to save the new refresh token
     * @param {*} token 
     * @returns 
     */
    static async generateRefreshToken( user ) {
        const refreshToken = jwt.sign( user, this.#refreshTokenSecret );
        await AuthController.saveRefreshToken( refreshToken );
        return refreshToken;
    }

    /**
     * Call userController to verify if a refresh token exists
     * @param {string} token 
     * @returns 
     */
    static refreshTokenExists( token ) {
        return AuthController.refreshTokenExists( token );
    }
}

module.exports = AuthService;