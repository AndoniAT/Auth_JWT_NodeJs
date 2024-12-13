/**
 * Author : Andoni ALONSO TORT
 */

// Variable for testing purpose
// Store in database in the future
let refreshTokens = [];

class AuthController {
    /**
     * Save a new refresh token in database
     * @param {string} token 
     * @returns {Array[string]} all refresh tokens
     */
    static async saveRefreshToken( token ) {
        refreshTokens.push( token );
        return refreshTokens;
    }

    /**
     * Verify in database if a given token exists
     * @param {string} token 
     * @returns {boolean}
     */
    static async refreshTokenExists( token ) {
        const tokenExists = refreshTokens.includes( token );
        return tokenExists;
    }

    /**
     * Remove a token from the database
     * @param {string} token 
     */
    static async removeToken( token ) {
        refreshTokens = refreshTokens.filter( t => t !== token );
        return true;
    }
}

module.exports = AuthController;