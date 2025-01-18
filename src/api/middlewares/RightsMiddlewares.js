const UserService = require( '../services/UserService' );
const CustomError = require( '../classes/curstomError' );

/**
 * Verify is the request is called by the same user to do actions to itself
 * or by an admin
 */
async function isMeOrAdmin( req, res, next ) {
    const { id } = req.params; // Take id from params
    const { user } = req.session; // Take the user connected

    try {
        const userFound = await UserService.getUserByEmail( user.email );
        if( !userFound ) {
            return res.sendStatus( 404 );
        }

        // Is admin or is me
        user.isMe = userFound._id.toString() === id;
    
        if( user.isAdmin || user.isMe ) {
            return next();
        }
    
        res.status( 401 ).json( 'Unauthorized: You are not allowed to do this action' );
    } catch( e ) {
        const { status, msg } = CustomError.getError( e );
        res.status( status ).json( msg );
    }

}

module.exports = {
    isMeOrAdmin
};