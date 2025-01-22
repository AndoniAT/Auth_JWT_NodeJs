/**
 * Author : Andoni ALONSO TORT
 */

const CustomError = require( '../classes/customError' );
const AuthHelpers = require( '../helpers/AuthHelpers' );
const UserHelpers = require('../helpers/UserHelpers');
const { User, Roles } = require( '../models/User' );

class UserService {

    static async getAll( projection = {} ) {
        projection = { ...projection, password: 0, refreshToken: 0 };
        return await User.find( {}, projection );
    };

    static async getUserById( id, projection = {} ) {
        projection = { ...projection };
        let projection_str = Object.keys( projection ).join( ' ' );

        const user = ( await User.where( '_id' ).equals( id ).
            select( projection_str )
            .select( '-password -refreshToken' )
            .exec() )[ 0 ];

        return user?.toObject();
    }

    static async getUserByEmail( email ) {
        const user = ( await User.where( 'email' ).equals( email ).exec() )[ 0 ];
        return user?.toObject();
    }

    static async getUserByRefreshToken( token ) {
        const user = await User.findOne( {
            'refreshToken' : {
                $in: [ token ]
            }
        } ).exec();

        return user?.toObject();
    }

    static async postUser( user ) {
        user = new User( user );
        let errors = {};

        let error_validation = user.validateSync();

        if( error_validation ) {
            errors = error_validation.errors;
        }

        const foundUser = ( await User.where( 'email' ).equals( user.email ).exec() )[ 0 ];

        if( foundUser ) {
            error_validation = true;
            errors.email = errors.email ?? `User ${user.email} already exists`;
        }

        const validPassword = UserHelpers.verifyPasswordRules( user.password );
        if( !validPassword ) {
            error_validation = true;
            errors.password = errors.password ?? { message: UserHelpers.password_rules_message };
        }

        if( error_validation ) {
            throw new CustomError( JSON.stringify( errors ), 400 );
        }

        // Hash password
        user.password = await AuthHelpers.generateHashPwd( user.password );

        // Save in database
        await user.save();
        return user?.toObject();
    }

    /**
     * Method created only to modify the refresh token for user
     * @param {String} email
     * @param {String[]} refreshToken
     * @returns {Promise<Object>} userFound
     */
    static async updateRefreshTokenUser( email, refreshToken ) {
        let userFound = ( await User.where( 'email' ).equals( email ) )[ 0 ];
        if( !userFound ) {
            const err = new CustomError( 'User not found', 400 );
            throw err;
        }

        userFound.refreshToken = refreshToken;
        await userFound.save();

        return userFound?.toObject();
    }

    static async updateUserByEmail( email, user ) {
        return await UserService.#updateUserBySomeAttr( 'email', email, user );
    }

    static async updateUserById( id, user ) {
        return await UserService.#updateUserBySomeAttr( '_id', id, user );
    }

    static async deleteUser( id ) {
        const user = ( await User.where( '_id' ).equals( id ) )[ 0 ];
        if( !user ) {
            const error = new CustomError( 'Not found', 404 );
            throw error;
        }

        return await User.deleteOne( { _id: id } );
    }

    /**
     * PRIVATE
     */

    /**
     * Modifies an user by the passed attribute
     * @param {String} attr : Name of the attribute with which we want to search for the user
     * @param {any} attrValue :Tthe value to match the user with the attribute
     * @param {Object} user : The object with the information we want to modify
     * @returns {Promise<Object>}
     */
    static async #updateUserBySomeAttr( attr, attrValue, user ) {
        let userFound = ( await User.where( attr ).equals( attrValue ).exec() )[ 0 ];

        if( !userFound ) {
            const err = new CustomError( 'User not found', 400 );
            throw err;
        }

        if( user.email ) {
            let emailRepeated = ( await User.where( 'email' ).equals( user.email ).exec() )[ 0 ];
            let emailsEquals = user.email ? ( user.email === userFound.email ) : false;

            if( emailRepeated && !emailsEquals ) {
                const err = new CustomError( `User ${user.email} already exists`, 403 );
                throw err;
            }
        }

        const allowedAttrToModif = new Set( [ 'firstname', 'lastname', 'email', 'password', 'roles' ] );
        for ( const prop of allowedAttrToModif.values() ) {
            if( user[ prop ] && User.schema.path( prop ) ) {
                let value = user[ prop ];

                if( prop === 'roles' ) {
                    // Verify roles
                    value = value.filter( v => Object.values( Roles ).includes( v ) );

                    if( !value.includes( Roles.user ) ) {
                        // The user always will have the user role
                        value.push( Roles.user );
                    }
                }

                userFound[ prop ] = value;
            }
        }

        let error_validation = userFound.validateSync();
        let errors = {};

        if( error_validation ) {
            errors = { ...error_validation.errors };
        }

        if( user.password ) {
            const validPassword = UserHelpers.verifyPasswordRules( user.password );
            if( !validPassword ) {
                error_validation = true;
                errors.password = errors.password ?? { password: { message: UserHelpers.password_rules_message } };
            }

            userFound.password = await AuthHelpers.generateHashPwd( user.password );
        }

        if( error_validation ) {
            throw new CustomError( JSON.stringify( errors ), 400 );
        }
    
        await userFound.save();

        return userFound?.toObject();
    }
};

module.exports = UserService;