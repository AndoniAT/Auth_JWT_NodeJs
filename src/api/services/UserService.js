const userController = require( '../controllers/UserController' );

/**
 * Call getAll function from controller to get all the users
 * @returns a list of all users
 */
async function getAllUsers() {
    const users = await userController.getAll();
    return users;
}

/**
 * Call postUser function from controller to create a new user
 * @param {*} user
 * @returns the new user
 */
async function createUser( user ){
    const newUser = await userController.postUser( user );
    return newUser;
}

module.exports = {
    getAllUsers: getAllUsers,
    createUser: createUser
};