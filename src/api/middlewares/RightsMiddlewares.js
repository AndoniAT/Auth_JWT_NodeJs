/**
 * Author : Andoni ALONSO TORT
 */

const UserService = require( '../services/UserService' );
const CustomError = require( '../classes/customError' );
const UserHelpers = require( '../helpers/UserHelpers' );

/**
 * Verify is the request is called by the same user to do actions to itself
 * or by an admin
 */
async function isMeOrAdmin( req, res, next ) {
    const userSession= req.session.user;
    const { id } = req.params;

    try {
        const userFound = await UserService.getUser( id );
        UserHelpers.detectUserFound( userFound );

        // Is admin or is me
        const { _id, username, email } = userFound;
        userSession.isMe = ( _id.toString() === id ) || ( username === userSession.username ) || ( email === userSession.email );

        if( userSession.isAdmin || userSession.isMe ) {
            return next();
        }
    
        res.status( 401 ).json( 'Unauthorized: You are not allowed to do this action' );
    } catch( e ) {
        const { status, message } = CustomError.getError( e );
        res.status( status ).json( { message } );
    }

}

module.exports = {
    isMeOrAdmin
};