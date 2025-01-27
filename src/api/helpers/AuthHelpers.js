/**
 * Author : Andoni ALONSO TORT
 */

const jwt = require( 'jsonwebtoken' );
const bcrypt = require( 'bcrypt' );
const CustomError = require( '../classes/customError' );

class AuthHelpers {
    // eslint-disable-next-line no-undef
    static #accesTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    // eslint-disable-next-line no-undef
    static #refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    /**
     * Hash a given password to store in database
     * @param {String} pwd
     * @returns {Promise<String>} Hashed password
     */
    static async generateHashPwd( pwd ) {
        const salt = await bcrypt.genSalt( 10 ); // 10 by detault
        const hashedPwd = await bcrypt.hash( pwd, salt );
        return hashedPwd;
    }

    /**
     * Compare a password string with a hash
     * @param {String} pwd
     * @param {String} hash
     * @returns 
     */
    static async comparePasswords( pwd, hash ) {
        const isSame = await bcrypt.compare( pwd, hash );
        return isSame;
    }

    /**
     * @param {String} token
     */
    static verifyToken( token, cb ) {
        jwt.verify( token, this.#accesTokenSecret, cb );
    }
    
    /**
     * @param {String} refreshToken
     */
    static verifyRefreshToken( refreshToken, cb ) {
        jwt.verify( refreshToken, this.#refreshTokenSecret, cb );
    }

    /**l
     * Sign jwt
     * @param {Object} user 
     * @returns {String} the geneated token
     */
    static generateAccesToken( user ) {
        AuthHelpers.#checkUserTypeToken( user );
        
        const us = { username: user.username, email: user.email, roles: user.roles };
        const token = jwt.sign( { user: us }, this.#accesTokenSecret, { expiresIn: '1m' } );
        return token;
        
    }

    /**
     * Call fuction in controller to save the new refresh token
     * @returns {string}
     */
    static generateRefreshToken( user ) {
        AuthHelpers.#checkUserTypeToken( user, false );
        const us = { username: user.username, email: user.email };
        const refreshToken = jwt.sign( { user: us }, this.#refreshTokenSecret, { expiresIn: '1d' }  );
        return refreshToken;
    }

    static #checkUserTypeToken( user, checkRoles = true ) {
        if( !user ) {
            throw new CustomError( 'No user passed in parameter', 400 );
        }
        const { username, email, roles } = user;
        if( !username || !email || ( checkRoles && !roles ) ) {
            let err = 'Missing one or more properties : username / email';
            err += ( checkRoles ) ? ' / roles' : '';
            throw new CustomError( err, 400 );
        }

        return user;
    }
}

module.exports = AuthHelpers;