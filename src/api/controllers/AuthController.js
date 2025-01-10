/**
 * Author : Andoni ALONSO TORT
 */
const UserService = require( '../services/UserService' );
const AuthHelpers = require( '../helpers/AuthHelpers' );

class AuthController {
    /**
     * Login the user in the application with the email and password
     */
    static async login( req, res ) {
        const { email, password } = req.body;
        if( !email || !password ) {
            return res.status( 400 ).json( {
                message: 'email and password are required'
            } );
        }

        try {
            const user = await UserService.getUserByEmail( email );
            if( !user ) {
                res.status( 400 ).json( 'Cannot find user' );
            }
            
            if( await AuthHelpers.comparePasswords( password, user.password ) ) {
                const accessToken = AuthHelpers.generateAccesToken( user );
                const refreshToken = await AuthHelpers.generateRefreshToken( user ); 
                // Saving refresh token with current user
                await UserService.updateUserByEmail( email, { refreshToken } );

                // Cookie as http only so it is not available in js
                res.cookie( 'jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true,
                    maxAge: 24 * 60 * 60  * 1000 } ); // 1 day as maxAge
                delete user.password;
                delete user.refreshToken;

                res.status( 200 ).json( {
                    user,
                    accessToken
                } );
            } else {
                res.status( 400 ).json( 'Bad password' );
            }

        } catch( e ) {
            const status = e?.status || 500;
            const msg = { Error : e?.message || 'Error Server' };
            res.status( status ).json( msg );
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

        AuthHelpers.verifyRefreshToken( refreshToken, ( err, user ) => {
            if( err || userFound.email !== user.email ) {
                return res.sendStatus( 403 );
            }

            delete userFound.password;
            delete userFound.refreshToken;

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

        const refreshToken = cookies.jwt;

        const userFound = await UserService.getUserByRefreshToken( refreshToken );
        if( !userFound ) {
            // If there was not a user but we have a token in cookies, then clear cookie
            res.clearCookie( 'jwt', { httpOnly: true } );
            return res.sendStatus( 204 ); // No content
        }

        // Delete refresh token in DB
        await UserService.updateUserByEmail( userFound.email, { refreshToken: null } );
        res.clearCookie( 'jwt', { httpOnly: true, sameSite: 'None', secure: true } ); // secure: true - only serves on https
        res.sendStatus( 204 );
    }
}

module.exports = AuthController;