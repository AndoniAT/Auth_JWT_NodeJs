/**
 * Author : Andoni ALONSO TORT
 */

const bcrypt = require( 'bcrypt' );
class AuthHelpers {
    /**
     * Hash a given password to store in database
     * @param {string} pwd 
     * @returns {string} Hashed password
     */
    static async generateHashPwd( pwd ) {
        const salt = await bcrypt.genSalt( 10 ); // 10 by detault
        const hashedPwd = await bcrypt.hash( pwd, salt );
        return hashedPwd;
    }

    /**
     * Compare a password string with a hash
     * @param {string} pwd 
     * @param {string} hash 
     * @returns 
     */
    static async comparePasswords( pwd, hash ) {
        const isSame = await bcrypt.compare( pwd, hash );
        return isSame;
    }
}

module.exports = AuthHelpers;