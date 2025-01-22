/**
 * Author : Andoni ALONSO TORT
 */

const CustomError = require( '../classes/customError' );
const UserService = require( '../services/UserService' );

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
     * Get user from db
     */
    static async getUser( req, res ) {
        let projection = req.session.user.isAdmin ? {} : { email : 1, firstname: 1, lastname: 1, roles: 1 };
        const { id } = req.params;

        let user = await UserService.getUserById( id, projection );

        if( user ) {
            return res.status( 200 ).json( user );   
        }

        res.sendStatus( 400 );
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
            if( !user.confirmPassword ) {
                const message = { confirmPassword: { message: 'There must be a confirmPassword attribute' } };
                return res.status( 400 ).json( { message } );
            }

            if( user.confirmPassword !== user.password ) {
                const message = { confirmPassword: { message: 'The passwords don\'t match' } };
                return res.status( 400 ).json( { message } );
            }

            const newUser = await UserService.postUser( user );
            res.status( 201 ).json( newUser );
        } catch ( e ) {
            const { status, message } = CustomError.getError( e );
            res.status( status ).json( { message } );
        }
    }
    
    /**
     * Call updateUser function from controller to update a user by id
     * @returns the modified user
     */
    static async updateUser( req, res ) {
        const { id } = req.params;
        const userSession = req.session;

        try {
            let {
                firstname,
                lastname,
                email,
                password,
                confirmPassword,
                roles
            } = req.body;

            if( password ) {
                if( !confirmPassword ) {
                    const message = { confirmPassword: { message: 'There must be a confirmPassword attribute' } };
                    return res.status( 400 ).json( { message } );
                }

                if( password !== confirmPassword ) {
                    const message = { confirmPassword: { message: 'The passwords don\'t match' } };
                    return res.status( 400 ).json( { message } );
                }
            }

            const user = { firstname, lastname, email, password, roles, confirmPassword };

            if( !userSession.user.isAdmin ) {
                // Normal user cannot modify any roles
                delete user.roles;
            }

            const userModif = await UserService.updateUserById( id, user );
            res.status( 200 ).json( userModif );

        } catch( e ) {
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
