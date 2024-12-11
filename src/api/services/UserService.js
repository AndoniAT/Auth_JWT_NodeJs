const userController = require( '../controllers/UserController' );

/**
 * Call getAll function from controller to get all the users
 * @returns a list of all users
 */
async function getAllUsers() {
    try {
        const users = await userController.getAll();
        return users;
    } catch( e ) {
        throw new Error( e );
    }
}

/**
 * Call postUser function from controller to create a new user
 * @param {*} user
 * @returns the new user
 */
async function createUser( user ){
    try {
        const newUser = await userController.postUser( user );
        return newUser;
    } catch( e ) {
        throw new Error( e );
    }
}

/**
 * Call deleteUser function from controller to delete a user by id
 * @param {String} id 
 * @returns the deleted user
 */
async function deleteUser( id ) {
    try {
        const userDeleted = await userController.deleteUser( id );
        return userDeleted;
    } catch( e ) {
        const err = new Error( e.message );
        err.status = e.status;
        throw err;
    }
}

module.exports = {
    getAllUsers,
    createUser,
    deleteUser
};