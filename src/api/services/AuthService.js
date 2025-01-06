/**
 * Author : Andoni ALONSO TORT
 */
// Variable for testing purpose
// Store in database in the future
let refreshTokens = [];

class AuthService {
    /**
     * Save a new refresh token in database
     * @param {string} token 
     * @returns {Promise<string[]>} all refresh tokens
     */
    static async saveRefreshToken( token ) {
        refreshTokens.push( token );
        return refreshTokens;
    }

    /**
     * Verify in database if a given token exists
     * @param {string} token 
     * @returns {Promise<boolean>}
     */
    static async refreshTokenExists( token ) {
        console.log("token pass", token );
        console.log("checking", refreshTokens);
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

module.exports = AuthService;