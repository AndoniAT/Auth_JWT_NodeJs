/**
 * Author : Andoni ALONSO TORT
 */

const users = [
    {
        _id: '1',
        name: 'Andoni',
        lastname: 'Alonso Tort',
        password: '$2b$10$jgUvUFbGPHmKDM/zWCxZ8.m4ItwK6g9Ar8du2m6.ISkY41iXu3ORK',
        email: 'andonialonsotort@gmail.com'
    }
];

class UserController {
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
        const user = users.find( user => user.email == email );
        return user;
    }
    
    /**
     * Create a new user in database
     * @param {*} user 
     * @returns the new user
     */
    static async postUser( user ) {
        users.push( user );
        return user;
    }
    
    /**
     * Delete the given user from the database
     * @param {String} id
     * @returns the deleted user
     */
    static async deleteUser( id ) {
        const ids = users.map( u => u._id );
    
        if( ids.includes( id ) ) {
            const idx = users.indexOf( id );
            const userDeleted = users.splice( idx, 1 );
            return userDeleted;
        }
    
        const error = new Error( 'Not found' );
        error.status = 404;
        throw error;
    }
};

module.exports = UserController;
