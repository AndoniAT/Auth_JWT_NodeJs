const CustomError = require( '../classes/curstomError' );
const AuthHelpers = require( '../helpers/AuthHelpers' );
const { User } = require( '../models/User' );
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
        let projection = req.session.user.isAdmin ? {} : { email : 1, firstname: 1, lastname: 1 };
        let users = await UserService.getAll( projection );
        res.status( 200 ).json( users );
    }
    
    /**
     * Call postUser function from controller to create a new user
     * @returns the new user
     */
    static async createUser( req, res ) {
        const user = req.body;
        try {
            // User cannot assign own roles
            delete user.roles;

            // Verify attributes
            let user_validated = new User( user );
            const error_validation = user_validated.validateSync();

            if( error_validation ) {
                return res.status( 400 ).json( error_validation.errors );
            }

            if( !user.confirmPassword ) {
                return res.status( 400 ).json( { confirmPassword: { message: 'There must be a confirmPassword attribute' } } );
            }

            if( user.confirmPassword !== user.password ) {
                return res.status( 400 ).json( { confirmPassword: { message: 'The passwords don\'t match' } } );
            }

            const pwd = await AuthHelpers.generateHashPwd( user.password );
            user.password = pwd; // Set hashed password
            const newUser = await UserService.postUser( user );
            res.status( 201 ).json( newUser );
        } catch ( e ) {
            const { status, message } = CustomError.getError( e );
            res.status( status ).json( { message } );
        }
    }
    
    /**
     * Call deleteUser function from controller to delete a user by id
     * @returns the deleted user
     */
    static async deleteUser( req, res ) {
        const { id } = req.params;

        try {
            const userDeleted = await UserService.deleteUser( id );

            if( req.session.isMe ){
                res.clearCookie( 'jwt', { httpOnly: true, sameSite: 'None', secure: true } );
            }
            
            res.status( 200 ).json( userDeleted );
        } catch( e ) {
            const { status, message } = CustomError.getError( e );
            res.status( status ).json( { message } );
        }
    }
};

module.exports = UserController;
