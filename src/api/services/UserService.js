/**
 * Author : Andoni ALONSO TORT
 */
const CustomError = require( '../classes/curstomError' );
const User = require( '../models/User' );

class UserService {
    /**
     * Get all the users from the database
     * @returns a list of all users
     */
    static async getAll() {
        return await User.find( {} );    
    };

    /**
     * Find a user by email in database
     * @param {string} email 
     * @returns
     */
    static async getUserByEmail( email ) {
        const user = ( await User.where( 'email' ).equals( email ) )[ 0 ];
        return user.toObject();
    }

    /**
     * Get a user with the refresh token
     * @param {string} token 
     * @returns {Promise<Object>} the user
     */
    static async getUserByRefreshToken( token ) {
        const user = ( await User.where( 'refreshToken' ).equals( token ) )[ 0 ];
        return user ? user.toObject() : null;
    }
    
    /**
     * Create a new user in database
     * @param {Object} user 
     * @returns the new user
     */
    static async postUser( user ) {
        user = new User( user );
        await user.save();
        return user.toObject();
    }

    /**
     * Update de user in database
     * @param {string} email
     * @param {Object} user Object with the properties we want to modify
     * @returns {Promise<Object>} the user modified
     */
    static async updateUserByEmail( email, user ) {
        let userFound = ( await User.where( 'email' ).equals( email ) )[ 0 ];
        if( !userFound ) {
            const err = new CustomError( 'User not found' );
            err.status= 400;
            throw err;
        }

        for( let prop in user ) {
            if ( Object.hasOwnProperty.call( userFound.toObject(), prop ) ) {
                userFound[ prop ] = user[ prop ];
            }
        }

        userFound.save();
        return userFound;
    }
    
    /**
     * Delete the given user from the database
     * @param {String} id
     * @returns the deleted user
     */
    static async deleteUser( id ) {
        const user = ( await User.where( '_id' ).equals( id ) )[ 0 ];
        if( !user ) {
            const error = new CustomError( 'Not found' );
            error.status = 404;
            throw error;
        }

        return await User.deleteOne( { _id: id } );
    
        
    }
};

module.exports = UserService;