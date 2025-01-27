/**
 * Author : Andoni ALONSO TORT
 */
const UserService = require( '../services/UserService' );
const AuthHelpers = require( '../helpers/AuthHelpers' );
const CustomError = require( '../classes/customError' );

class AuthController {
    /**
     * Login the user in the application with the email and password
     */
    static async login( req, res ) {
        const cookies = req.cookies;
        const { username, password } = req.body;

        if( !username || !password ) {
            const error = new CustomError( 'username and password are required', 400 );
            const { status, message } = error.getDetails();
            return res.status( status ).json( { message } );
        }

        try {

            const user = await UserService.getUser( username );

            if( !user ) {
                const error = new CustomError( 'Cannot find user', 400 );
                const { status, message } = error.getDetails();
                return res.status( status ).json( { message } );
            }

            if( await AuthHelpers.comparePasswords( password, user.password ) ) {
                const accessToken = AuthHelpers.generateAccesToken( user );
                const refreshToken = AuthHelpers.generateRefreshToken( user ); 

                let newRefreshTokenArray = !cookies?.jwt ? user.refreshToken : user.refreshToken.filter( rt => rt !== cookies.jwt );

                if ( cookies?.jwt ) {

                    /*
                        If jwt exists in cookies
                            1) User logs in but never uses the Refresh Token and does not logout
                            2) Refresh Token is stolen
                            3) If 1 and 2, reuse detection is needed to clear all Refresh Tokens when user logs in
                    */
                    const refreshToken = cookies.jwt;
                    const foundUserToken = await UserService.getUserByRefreshToken( refreshToken );

                    // Detected refresh token reuse!
                    if ( !foundUserToken ) {
                        console.log( 'Attempted refresh token reuse at login!' );
                        // clear out all previous refresh tokens
                        newRefreshTokenArray = [];
                    }

                    res.clearCookie( 'jwt', { httpOnly: true, sameSite: 'None', secure: true } );
                }

                // Saving refresh token with current user
                let rt = [ ...newRefreshTokenArray, refreshToken ];
                await UserService.updateRefreshTokenUser( username, rt );

                // Cookie as http only so it is not available in js
                res.cookie( 'jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true,
                    maxAge: 24 * 60 * 60  * 1000 } ); // 1 day as maxAge

                res.status( 200 ).json( {
                    accessToken
                } );
            } else {
                const error = new CustomError( 'Bad password', 400 );
                const { status, message } = error.getDetails();
                res.status( status ).json( { message } );
            }

        } catch( e ) {
            const { status, message } = CustomError.getError( e );
            res.status( status ).json( { message } );
        }
    }

    /**
     * Generate refreshToken
     */
    static async refreshToken( req, res ) {
        const cookies = req.cookies;

        if( !cookies?.jwt ) {
            return res.sendStatus( 401 );
        }

        const refreshToken = cookies.jwt;
        if( !refreshToken ) {
            return res.sendStatus( 401 );
        }

        const userFound = await UserService.getUserByRefreshToken( refreshToken );

        if( !userFound ) {
            return res.sendStatus( 401 );
        }

        AuthHelpers.verifyRefreshToken( refreshToken, ( err, decoded ) => {
            const { user } = decoded;

            if( err || userFound.email !== user.email ) {
                return res.sendStatus( 403 );
            }

            const accessToken = AuthHelpers.generateAccesToken( userFound );
            res.json( {
                accessToken
            } );
        } );
    }

    /**
     * Logout from the application
     */
    static async logout( req, res ) {
        const { cookies } = req;

        if( !cookies?.jwt ) {
            return res.sendStatus( 204 ); // No content
        }

        try {
            const refreshToken = cookies.jwt;

            const userFound = await UserService.getUserByRefreshToken( refreshToken );
            if( userFound ) {
                // Delete refresh token in DB
                const rt = userFound.refreshToken.filter( token => token !== refreshToken );
                await UserService.updateRefreshTokenUser( userFound.username, rt );
            }

            res.clearCookie( 'jwt', { httpOnly: true, sameSite: 'None', secure: true } );
            res.sendStatus( 204 );
        } catch( e ) {
            const { status, message } = CustomError.getError( e );
            res.status( status ).json( { message } );
        }
    }
}

module.exports = AuthController;