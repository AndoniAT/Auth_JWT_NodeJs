/**
 * Author : Andoni ALONSO TORT
 */

const UserController = require( '../controllers/UserController' );
const AuthHelpers = require( '../helpers/AuthHelpers' );

class UserService {

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
        const pwd = await AuthHelpers.generateHashPwd( user.password );
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