const users = [
    {
        _id: '1',
        name: 'Andoni',
        lastname: 'Alonso Tort',
        password: 'pwd',
        email: 'andonialonsotort@gmail.com'
    }
];

/**
 * Get all the users from the database
 * @returns a list of all users
 */
async function getAll() {
    return users;    
};

/**
 * Create a new user in database
 * @param {*} user 
 * @returns the new user
 */
async function postUser( user ) {
    users.push( user );
    return user;
}

/**
 * Delete the given user from the database
 * @param {String} id
 * @returns the deleted user
 */
async function deleteUser( id ) {
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

module.exports = {
    getAll,
    postUser,
    deleteUser
};
