/**
 * Author : Andoni ALONSO TORT
 */

class CustomError extends Error {
    status;

    constructor( msg, status ) {
        super( msg );
        this.status = status;
        Object.setPrototypeOf( this, CustomError.prototype );

    }

    getDetails() {
        return CustomError.getError( this );
    };

    static getError( e ) {
        const status = e?.status || 500;
        let message = 'Error Server';

        if( e?.message ) {
            try {
                message = JSON.parse( e.message );
            } catch {
                message = e.message;
            }
        }

        return {
            status, message
        };
    }
}

module.exports = CustomError;