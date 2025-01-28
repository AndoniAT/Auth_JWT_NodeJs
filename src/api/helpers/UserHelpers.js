/**
 * Author : Andoni ALONSO TORT
 */

const CustomError = require( '../classes/customError' );
const { Roles } = require( '../models/User' );

class UserHelpers {

    static passwordRulesMessage = 'The password must have: /At least one special character (e.g., @$!%*?&()#^/)./At least one uppercase letter./At least one lowercase letter./At least one number.';
    static usernameRulesMessage = 'The username cannot contain special characters.';
    static userNotFoundMessage = 'User not found';
    static emailRulesMessage = 'The email should be a valid address: example@example.com';

    /**
     *  Verify if the password passed in params is secure
     * 
     *  The password must have :
     *      => Minimum Length: At least 8 characters.
     *      => Special Characters: At least one special character (e.g., @$!%*?&()#^).
     *      => Uppercase Letters: At least one uppercase letter.
     *      => Lowercase Letters: At least one lowercase letter.
     *      => Numbers: At least one number.
     *   
     *  REGEX explanation :
     *      => ^: Start of the string.
     *      => (?=.*[A-Z]): Must contain at least one uppercase letter.
     *      => (?=.*[a-z]): Must contain at least one lowercase letter.
     *      => (?=.*\d): Must contain at least one digit.
     *      => (?=.*[@$!%*?&()#^/]): Must contain at least one special character from the specified set (@$!%*?&()#^/).
     *      => [A-Za-z\d@$!%*?&()#^/]{8,}: Must be at least 8 characters long, using letters, digits, and the allowed special characters.
     *      => $: End of the string.
     * @param {String} pwd
     * @returns {Boolean}
     */
    static verifyPasswordRules( pwd ) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&()#^/])[A-Za-z\d@$!%*?&()#^/]{8,}$/;
        return passwordRegex.test( pwd );
    }

    /**
     * Verify that a given username does not containa any special characters
     * @param {String} username
     * @returns {Boolean}
     */
    static verifyUsernameRules( username ) {
        if( !username ) {
            return false;
        }

        if( username.length < 3 ) {
            return false;
        }

        const specialCharactersRegex = /^[a-zA-Z0-9]*$/;
        return specialCharactersRegex.test( username );
    }

    /**
     * Verify that a given username does not containa any special characters
     * @param {String} email
     * @returns {Boolean}
     */
    static verifyEmailRules( email ) {
        if( !email ) {
            return false;
        }

        if( email.length < 10 ) {
            return false;
        }

        const specialCharactersRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return specialCharactersRegex.test( email );
    }

    /**
     * Get errors in an update verifying rules
     * Each attribute is a function that returns an error (if exists)
     * with its message of the corresponding attribute
     */
    static getUpdateValueErrors = {
        username: ( username ) => ( UserHelpers.verifyUsernameRules( username ) ) ? {} : { username : { message: UserHelpers.usernameRulesMessage } },
        email: ( email ) => ( UserHelpers.verifyEmailRules( email ) ) ? {} : { email : { message: UserHelpers.emailRulesMessage } },
        password: ( password ) => ( UserHelpers.verifyPasswordRules( password ) ) ? {} : { password : { message: UserHelpers.passwordRulesMessage  } }
    };

    /**
     * Throw an error if the user has not been found
     * Function conceived to return a 404 not found error in APIs
     * @param {Object} user
     */
    static detectUserFound( user ) {
        if( !user ) {
            throw new CustomError( UserHelpers.userNotFoundMessage, 404 );
        }
    }

    static hasAdminRole( roles ) {
        if( !roles || !Array.isArray( roles ) ) {
            return false;
        }
        return roles.includes( Roles.admin );
    }
}

module.exports = UserHelpers;