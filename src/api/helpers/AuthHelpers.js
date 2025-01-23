/**
 * Author : Andoni ALONSO TORT
 */

const jwt = require( 'jsonwebtoken' );
const bcrypt = require( 'bcrypt' );

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

    /**
     * Sign jwt
     * @param {Object} user 
     * @returns {String} the geneated token
     */
    static generateAccesToken( user ) {
        const us = { username: user.username, email: user.email, roles: user.roles };
        const token = jwt.sign( { user: us }, this.#accesTokenSecret, { expiresIn: '10m' } );
        return token;
        
    }

    /**
     * Call fuction in controller to save the new refresh token
     * @returns {Promise<string>}
     */
    static async generateRefreshToken( user ) {
        const us = { username: user.username, email: user.email };
        const refreshToken = jwt.sign( us, this.#refreshTokenSecret, { expiresIn: '1d' }  );
        return refreshToken;
    }
}

module.exports = AuthHelpers;