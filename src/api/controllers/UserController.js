/**
 * Author : Andoni ALONSO TORT
 */

const CustomError = require( '../classes/customError' );
const UserHelpers = require( '../helpers/UserHelpers' );
const { Roles } = require( '../models/User' );
const UserService = require( '../services/UserService' );

class UserController {

    static async getAllUsers( req, res ) {
        const userSession = req.session.user;
        let projection = userSession.isAdmin ? null : { username: 1, firstname: 1, lastname: 1 };
        let users = await UserService.getAll( projection );
        res.status( 200 ).json( users );
    }

    static async getUser( req, res ) {
        const userSession = req.session.user;
        let projection = userSession.isAdmin ? {} : { username: 1, email : 1, firstname: 1, lastname: 1, roles: 1 };
        const { id } = req.params;

        let user = await UserService.getUser( id, projection );

        if( user ) {
            return res.status( 200 ).json( user );   
        }

        res.sendStatus( 404 );
    }
    
    static async createUser( req, res ) {
        const user = req.body;
        try {
            // User cannot assign own roles
            delete user.roles;
            user.roles = [ Roles.user ];

            // Verify attributes
            if( !user.confirmPassword ) {
                const message = { confirmPassword: { message: 'There must be a confirmPassword attribute' } };
                return res.status( 400 ).json( { message } );
            }

            if( user.confirmPassword !== user.password ) {
                const message = { confirmPassword: { message: 'The passwords don\'t match' } };
                return res.status( 400 ).json( { message } );
            }

            const newUser = await UserService.createUser( user );
            res.status( 201 ).json( newUser );
        } catch ( e ) {
            const { status, message } = CustomError.getError( e );
            res.status( status ).json( { message } );
        }
    }

    static async updateUser( req, res ) {
        const userSession = req.session.user;
        const { id } = req.params;

        try {
            let {
                username,
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

            let body = { username, firstname, lastname, email, password, roles, confirmPassword };

            if( !userSession.isAdmin ) {
                // Normal user cannot modify any roles
                delete body.roles;
            }

            const userBefore = await UserService.getUser( id, { username: 1, email: 1, roles: 1 } );

            // Cannot remove last admin
            if( body.roles ) {
                const admins = await UserService.getAdminCount();
                
                if( !UserHelpers.hasAdminRole( body.roles ) &&
                    UserHelpers.hasAdminRole( userBefore.roles ) && 
                    admins == 1 ) {
                    let message = 'You cannot remove admin rights because is the last admin';
                    return res.status( 401 ).json( { message } );
                }
            }

            let user = await UserService.updateUser( id, body );


            const usernameHasChanged = ( userBefore.username !== user.username );
            const emailHasChanged = ( userBefore.email !== user.email );
            const rolesHasChanged = !( userBefore?.roles.every( r => user.roles.includes( r ) ) && user.roles.every( r => userBefore.roles.includes( r ) ) );

            // Clear cookie is is my session and sensitive information have changed
            if( ( usernameHasChanged || emailHasChanged || rolesHasChanged ) ) {
                await UserService.updateRefreshTokenUser( user.username, [] );

                if( userSession.isMe ) {
                    res.clearCookie( 'jwt', { httpOnly: true, sameSite: 'None', secure: true } );
                }
            }

            let projection = userSession.isAdmin ? {} : { username: 1, email : 1, firstname: 1, lastname: 1, roles: 1 };
            user = await UserService.getUser( id, projection );
            res.status( 200 ).json( user );

        } catch( e ) {
            const { status, message } = CustomError.getError( e );
            res.status( status ).json( { message } );
        }
    }

    static async deleteUser( req, res ) {
        const userSession = req.session.user;
        const { id } = req.params;

        try {
            const admins = await UserService.getAdminCount();
            const user = await UserService.getUser( id, { roles: 1 } );

            if( UserHelpers.hasAdminRole( user.roles ) && admins == 1 ) {
                let message = 'You cannot delete the unique admin user';
                return res.status( 401 ).json( { message } );
            }

            const userDeleted = await UserService.deleteUser( id );
            if( userSession.isMe ) {
                res.clearCookie( 'jwt', { httpOnly: true, sameSite: 'None', secure: true } );
            }
            
            res.status( 200 ).json( userDeleted );
        } catch( e ) {
            console.log( e );
            const { status, message } = CustomError.getError( e );
            res.status( status ).json( { message } );
        }
    }
};

module.exports = UserController;
