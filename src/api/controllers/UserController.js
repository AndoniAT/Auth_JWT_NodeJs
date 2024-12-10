const users = [
    {
        name: 'Andoni',
        lastname: 'Alonso Tort'
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
module.exports = {
    getAll: getAll,
    postUser: postUser
};
