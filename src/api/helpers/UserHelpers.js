/**
 * Author : Andoni ALONSO TORT
 */

class UserHelpers {

    static password_rules_message = 'The password must have: /At least one special character (e.g., !@#$%^&*())./At least one uppercase letter./At least one lowercase letter./At least one number.';
    
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
     * @param {string} pwd 
     * @returns {Boolean}
     */
    static verifyPasswordRules( pwd ) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test( pwd );
    }
}

module.exports = UserHelpers;