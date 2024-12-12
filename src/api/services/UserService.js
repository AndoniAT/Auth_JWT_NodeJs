/* eslint-disable no-undef */
/**
 * Author : Andoni ALONSO TORT
 */

const UserController = require( '../controllers/UserController' );
const UserHelpers = require( '../helpers/UserHelpers' );
const jwt = require( 'jsonwebtoken' );

class UserService {

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

        if( await UserHelpers.comparePasswords( password, user.password ) ) {
            const accessToken = UserService.generateAccesToken( user );
            const refreshToken = await UserService.generateRefreshToken( user );

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
     * @param {function name( err, user ) {}} cb 
     */
    static verifyToken( token, cb ) {
        jwt.verify( token, process.env.ACCESS_TOKEN_SECRET, cb );
    }

    /**
     * 
     * @param {string} refreshToken 
     * @param {function name( err, user ) {}} cb 
     */
    static verifyRefreshToken( refreshToken, cb ) {
        jwt.verify( refreshToken, process.env.REFRESH_TOKEN_SECRET, cb );
    }

    /**
     * Sign jwt
     * @param {*} user 
     * @returns {string} the geneated token
     */
    static generateAccesToken( user ) {
        return jwt.sign( user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' } );
    }

    /**
     * Call fuction in controller to save the new refresh token
     * @param {*} token 
     * @returns 
     */
    static async generateRefreshToken( user ) {
        const refreshToken = jwt.sign( user, process.env.REFRESH_TOKEN_SECRET );
        await UserController.saveRefreshToken( refreshToken );
        return refreshToken;
    }

    /**
     * Call userController to verify if a refresh token exists
     * @param {string} token 
     * @returns 
     */
    static refreshTokenExists( token ) {
        return UserController.refreshTokenExists( token );
    }

    /**
     * 
     * @param {string} token 
     * @returns 
     */
    static logout( token ) {
        return UserController.removeToken( token );
    }

    /**
     * Call getAll function from controller to get all the users
     * @returns a list of all users
     */
    static async getAllUsers() {
        const users = await UserController.getAll();
        return users;
    }
    
    /**
     * Call postUser function from controller to create a new user
     * @param {*} user
     * @returns the new user
     */
    static async createUser( user ){
        const pwd = await UserHelpers.generateHashPwd( user.password );
        user.password = pwd; // Set hashed password
        const newUser = await UserController.postUser( user );
        return newUser;
    }
    
    /**
     * Call deleteUser function from controller to delete a user by id
     * @param {String} id 
     * @returns the deleted user
     */
    static async deleteUser( id ) {
        const userDeleted = await UserController.deleteUser( id );
        return userDeleted;
    }
};

module.exports = UserService;