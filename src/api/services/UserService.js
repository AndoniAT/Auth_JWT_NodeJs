/**
 * Author : Andoni ALONSO TORT
 */
// Constant for testing purpose

const CustomError = require( '../classes/curstomError' );

const ROLES = {
    admin: 1000,
    user: 2000
};

// Store in database in the future
const users = [
    {
        _id: '1',
        firstname: 'Andoni',
        lastname: 'Alonso Tort',
        password: '$2b$10$u2tk/H6htFHNOgOpC5W7Y.9jZdrW2TfYBlWah31ko5Fjvbp/Kxe6y',
        email: 'andonialonsotort@gmail.com',
        roles: ROLES.admin,
        refreshToken: null
    },
    {
        _id: '2',
        firstname: 'Jean',
        lastname: 'Claude',
        password: '$2b$10$u2tk/H6htFHNOgOpC5W7Y.9jZdrW2TfYBlWah31ko5Fjvbp/Kxe6y',
        email: 'jeanclaude@example.com',
        roles: ROLES.user,
        refreshToken: null
    }
];

class UserService {
    /**
     * Get all the users from the database
     * @returns a list of all users
     */
    static async getAll() {
        return users;    
    };

    /**
     * Find a user by email in database
     * @param {string} email 
     * @returns
     */
    static async getUserByEmail( email ) {
        const user = users.find( user => user.email === email );
        return { ...user };
    }

    /**
     * Get a user with the refresh token
     * @param {string} token 
     * @returns {Promise<Object>} the user
     */
    static async getUserByRefreshToken( token ) {
        const user = users.find( user => user.refreshToken === token );
        return user ? { ...user } : null;
    }
    
    /**
     * Create a new user in database
     * @param {*} user 
     * @returns the new user
     */
    static async postUser( user ) {
        user.roles = [ ROLES.user ];
        user.refreshToken = null;
        users.push( user );
        return { ...user };
    }

    /**
     * Update de user in database
     * @param {string} email
     * @param {Object} user Object with the properties we want to modify
     * @returns {Promise<Object>} the user modified
     */
    static async updateUserByEmail( email, user ) {
        let userFound = users.find( u => u.email == email );
        if( !userFound ) {
            const err = new CustomError( 'User not found' );
            err.status= 400;
            throw err;
        }

        for( let prop in user ) {
            if ( Object.hasOwnProperty.call( userFound, prop ) ) {
                userFound[ prop ] = user[ prop ];
            }
        }

        return { ...userFound };
    }
    
    /**
     * Delete the given user from the database
     * @param {String} id
     * @returns the deleted user
     */
    static async deleteUser( id ) {
        const ids = users.map( u => u._id );
    
        if( ids.includes( id ) ) {
            const idx = ids.indexOf( id );
            const userDeleted = users.splice( idx, 1 );
            return { ...userDeleted };
        }
    
        const error = new CustomError( 'Not found' );
        error.status = 404;
        throw error;
    }
};

module.exports = UserService;