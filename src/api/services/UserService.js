/**
 * Author : Andoni ALONSO TORT
 */

const { default: mongoose } = require( 'mongoose' );
const AuthHelpers = require( '../helpers/AuthHelpers' );
const GralHelpers = require( '../helpers/GralHelpers' );
const UserHelpers = require( '../helpers/UserHelpers' );
const { User, Roles } = require( '../models/User' );

class UserService {

    static async getAll( projection ) {
        projection = projection ?? { password: 0, refreshToken: 0 };
        return await User.find( {}, projection );
    };

    /**
     * Get user by a unique value
     * @param {String} findValue : Could be _id, username, email
     * @param {Object} projection
     * @returns {Promise<Object>}
     */
    static async getUser( findValue, projection = {} ) {
        let projection_str = Object.keys( projection ).join( ' ' );
        const isObjectId = mongoose.Types.ObjectId.isValid( findValue );

        const match = [
            ...( isObjectId ? [{ _id: findValue }] : [] ),
            { email: findValue },
            { username: findValue },
        ];

        const user = (
            await User.where( '$or' )
                .equals( match ).
                select( projection_str )
                .exec() )[ 0 ];

        return user;
    }

    static async getUserByRefreshToken( token, projection = {} ) {
        const user = await User.findOne( {
            'refreshToken' : {
                $in: [ token ]
            }
        }, projection ).exec();

        return user;
    }

    static async createUser( user ) {
        user = new User( user );

        GralHelpers.detectError( {
            ...user.validateSync(), // Validate model
            ...await UserService.#verifyRepeatedUsername( user.username ), // Verify username existance
            ...await UserHelpers.getUpdateValueErrors.username( user.username ), // Verify username value model
            ...await UserService.#verifyRepeatedEmail( user.email ), // Verify email
            ...await UserHelpers.getUpdateValueErrors.password( user.password ) // Verify password form
        } ); // Catch errors

        // Hash password
        user.password = await AuthHelpers.generateHashPwd( user.password );

        // Save in database
        await user.save();
        return user;
    }

    /**
     * Modifies an user by the passed attribute
     * @param {String} id : Could be _id, email or username
     * @param {Object} body : The object with the information we want to modify
     * @returns {Promise<Object>}
     */
    static async updateUser( id, body ) {
        let oldUser = await UserService.getUser( id );
        UserHelpers.detectUserFound( oldUser );

        let { password } = body;

        let newUser = body;
        //  == Errors ==
        let usernameRepeated = await UserService.#verifyRepeatedUsername( newUser.username ); // Verify username
        let isNotSameUser = ( newUser.username !== oldUser.username );
        let usernameError = ( usernameRepeated && isNotSameUser ) ? usernameRepeated : {};
        let emailRepeated = await UserService.#verifyRepeatedEmail( newUser.email );
        isNotSameUser = ( newUser.email !== oldUser.email );
        let emailError = ( emailRepeated && isNotSameUser ) ? emailRepeated : {}; // Email is different

        // Set Information and get Errors
        let info = await UserService.#setUserInformation( oldUser, newUser );
        let user = info.user;

        GralHelpers.detectError( {
            // Repeated errors
            ...usernameError,
            ...emailError,
            // Model errors
            ...info.errors,
            ...user.validateSync()
        } ); // Catch errors

        // == Ready to save ==

        // Hash password
        if( password ) {
            user.password = await AuthHelpers.generateHashPwd( password );
        }

        user.updatedAt = new Date();
        await user.save();
        return user;
    }

    /**
     * Method created only to modify the refresh token for user
     * @param {String} id : Could be _id, username or email
     * @param {String[]} refreshToken
     * @returns {Promise<Object>} userFound
     */
    static async updateRefreshTokenUser( id, refreshToken ) {
        let user = await UserService.getUser( id );
        UserHelpers.detectUserFound( user );

        user.refreshToken = refreshToken;
        user.updatedAt = new Date();
        await user.save();

        return user;
    }

    static async deleteUser( id ) {
        const user = await UserService.getUser( id );
        UserHelpers.detectUserFound( user );

        return await User.deleteOne( { _id: user._id } );
    }

    /**
     * PRIVATE
     */

    /**
     * Set properties in oldUser with new information
     * and get the errors from each attribute
     * @param {Object} oldUser
     * @param {Object} newUser
     * @returns {Promise<{errors:Object, user:Object}>}
     */
    static async #setUserInformation( oldUser, newUser ) {
        const allowedAttrToModif = new Set( [ 'username', 'firstname', 'lastname', 'email', 'password', 'roles' ] );

        let errors = {};

        for ( const prop of allowedAttrToModif.values() ) {
            const invalidProperty = !( newUser[ prop ] && User.schema.path( prop ) );

            if( invalidProperty ) continue;

            let value = newUser[ prop ];

            switch( prop ) {
            case 'roles': {
                // Verify roles
                value = value.filter( v => Object.values( Roles ).includes( v ) );
                if( !value.includes( Roles.user ) ) {
                    // The user always will have the user role
                    value.push( Roles.user );
                }
                break;
            }
            case 'username': {
                errors = { ...errors, ...await UserHelpers.getUpdateValueErrors.username( value ) };
                break;
            }
            case 'password': {
                errors = { ...errors, ...await UserHelpers.getUpdateValueErrors.password( value ) };
                break;
            }

            }

            oldUser[ prop ] = value;
        }

        return {
            errors,
            user: oldUser
        };
    }

    static async #verifyRepeatedEmail( email ) {
        let errors = {};
        const foundUserByEmail = await UserService.getUser( email );
        if( foundUserByEmail ) {
            errors.email = { message: `User with email "${email}" already exists` };
        }
        return errors;
    }

    static async #verifyRepeatedUsername( username ) {
        let errors = {};
        const usernameRepeated = await UserService.getUser( username );
        if( usernameRepeated ) {
            errors.username = { message: `User with username "${username}" already exists` };
        }
        return errors;
    }
};

module.exports = UserService;