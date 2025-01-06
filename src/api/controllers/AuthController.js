/**
 * Author : Andoni ALONSO TORT
 */
const UserService = require( '../services/UserService' );
const AuthService = require( '../services/AuthService' );
const AuthHelpers = require( '../helpers/AuthHelpers' );

class AuthController {
    /**
     * Login the user in the application with the email and password
     */
    static async login( req, res ) {
        const { email, password } = req.body;
        try {
            const user = await UserService.getUserByEmail( email );
            if( !user ) {
                res.status( 400 ).json( 'Cannot find user' );
            }

            if( await AuthHelpers.comparePasswords( password, user.password ) ) {
                const accessToken = AuthHelpers.generateAccesToken( user );
                const refreshToken = await AuthHelpers.generateRefreshToken( user );

                res.status( 200 ).json( {
                    user,
                    accessToken,
                    refreshToken
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
    static async token( req, res ) {
        const refreshToken = req.body.token;

        if( !refreshToken ) {
            return res.sendStatus( 401 );
        }

        if( !await AuthService.refreshTokenExists( refreshToken ) ) {
            return res.sendStatus( 403 );
        }

        AuthHelpers.verifyRefreshToken( refreshToken, ( err, user ) => {
            if( err ) {
                return res.sendStatus( 403 );
            }

            const accessToken = AuthHelpers.generateAccesToken( { firstname : user.firstname } );
            res.json( {
                accessToken
            } );
        } );
    }

    /**
     * Logout from the applucation
     */
    static logout( req, res ) {
        const { token } = req.body;

        AuthService.removeToken( token )
            .then( () => res.sendStatus( 204 ) )
            .catch( () => res.sendStatus( 500 ) );
    }
}

module.exports = AuthController;