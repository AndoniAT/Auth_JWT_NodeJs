/**
 * Author : Andoni ALONSO TORT
 */

const userController = require( '../controllers/UserController' );
const userHelpers = require( '../helpers/UserHelpers' );

class UserService {

    /**
     * Login the user in the application with the email and password
     * @param {string} email 
     * @param {string} password 
     * @returns
     */
    static async login( email, password ) {
        const user = await userController.getUserByEmail( email );
        if( !user ) {
            const error = new Error( 'Cannot find user' );
            error.status = 400;
            throw error;
        }

        if( await userHelpers.comparePasswords( password, user.password ) ) {
            return user;
        } else {
            const error = new Error( 'Bad password' );
            error.status = 400;
            throw error;
        }
    }

    /**
     * Call getAll function from controller to get all the users
     * @returns a list of all users
     */
    static async getAllUsers() {
        const users = await userController.getAll();
        return users;
    }
    
    /**
     * Call postUser function from controller to create a new user
     * @param {*} user
     * @returns the new user
     */
    static async createUser( user ){
        const pwd = await userHelpers.generateHashPwd( user.password );
        user.password = pwd; // Set hashed password
        const newUser = await userController.postUser( user );
        return newUser;
    }
    
    /**
     * Call deleteUser function from controller to delete a user by id
     * @param {String} id 
     * @returns the deleted user
     */
    static async deleteUser( id ) {
        const userDeleted = await userController.deleteUser( id );
        return userDeleted;
    }
};

module.exports = UserService;