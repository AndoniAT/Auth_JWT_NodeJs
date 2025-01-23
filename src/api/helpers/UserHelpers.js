/**
 * Author : Andoni ALONSO TORT
 */

const CustomError = require( '../classes/customError' );

class UserHelpers {

    static password_rules_message = 'The password must have: /At least one special character (e.g., !@#$%^&*())./At least one uppercase letter./At least one lowercase letter./At least one number.';
    static username_rules_message = 'The username cannot contain special characters.';
    static user_not_found_message = 'User not found';

    /**
     *  Verify if the password passed in params is secure
     * 
     *  The password must have :
     *      => Minimum Length: At least 8 characters.
     *      => Special Characters: At least one special character (e.g., !@#$%^&*()).
     *      => Uppercase Letters: At least one uppercase letter.
     *      => Lowercase Letters: At least one lowercase letter.
     *      => Numbers: At least one number.
     *   
     *  REGEX explanation :
     *      => ^: Start of the string.
     *      => (?=.*[A-Z]): Must contain at least one uppercase letter.
     *      => (?=.*[a-z]): Must contain at least one lowercase letter.
     *      => (?=.*\d): Must contain at least one digit.
     *      => (?=.*[@$!%*?&]): Must contain at least one special character from the specified set (@$!%*?&).
     *      => [A-Za-z\d@$!%*?&]{8,}: Must be at least 8 characters long, using letters, digits, and the allowed special characters.
     *      => $: End of the string.
     * @param {String} pwd
     * @returns {Boolean}
     */
    static verifyPasswordRules( pwd ) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test( pwd );
    }

    /**
     * Verify that a given username does not containa any special characters
     * @param {String} username
     * @returns {Boolean}
     */
    static verifyUsernameRules( username ) {
        const specialCharactersRegex = /^[a-zA-Z0-9]*$/;
        return specialCharactersRegex.test( username );
    }

    /**
     * Get errors in an update verifying rules and
     * comparing old and new values
     * Each attribute is a function that returns an error (if exists)
     * with its message of the corresponding attribute
     */
    static getUpdateValueErrors = {
        username: async ( username )=> ( UserHelpers.verifyUsernameRules( username ) ) ? {} : { username : { message: UserHelpers.username_rules_message } },
        password: async ( password ) => ( UserHelpers.verifyPasswordRules( password ) ) ? {} : { password : { message: UserHelpers.password_rules_message  } },
    };

    static detectUserFound( user ) {
        if( !user ) {
            throw new CustomError( UserHelpers.user_not_found_message, 404 );
        }
    }
}

module.exports = UserHelpers;