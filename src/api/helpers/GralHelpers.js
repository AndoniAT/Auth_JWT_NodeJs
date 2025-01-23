const CustomError = require( '../classes/customError' );

class GralHelpers {
    /**
     * Function taking errors object as parameter
     * if there are any error inside the object
     * the function will throw the errors stringified
     * @param {Object} errors 
     * @param {number|undefined} status 
     */
    static detectError( errors, status = 400 ) {
        const errorsExists = ( Object.keys( errors ).length > 0 );
        if( errorsExists ) {
            throw new CustomError( JSON.stringify( errors ), status );
        }
    }
}

module.exports = GralHelpers;