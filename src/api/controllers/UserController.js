const AuthHelpers = require( '../helpers/AuthHelpers' );
const UserService = require( '../services/UserService' );

/**
 * Author : Andoni ALONSO TORT
 */
class UserController {

    /**
     * Call getAll function from controller to get all the users
     * @returns a list of all users
     */
    static async getAllUsers( req, res ) {
        const users = await UserService.getAll();
        res.status( 200 ).json( users );
    }
    
    /**
     * Call postUser function from controller to create a new user
     * @returns the new user
     */
    static async createUser( req, res ) {
        const user = req.body;
        const pwd = await AuthHelpers.generateHashPwd( user.password );
        user.password = pwd; // Set hashed password
        user.roles = [ 2000 ];
        const newUser = await UserService.postUser( user );
        res.status( 201 ).json( newUser );
    }
    
    /**
     * Call deleteUser function from controller to delete a user by id
     * @returns the deleted user
     */
    static async deleteUser( req, res ) {
        const { id } = req.params;

        try {
            const userDeleted = await UserService.deleteUser( id );
            res.status( 200 ).json( userDeleted );
        } catch( e ) {
            const status = e?.status || 500;
            const msg = { Error : e?.message || 'Error Server' };

            res.status( status ).json( msg );
        }
    }
};

module.exports = UserController;
