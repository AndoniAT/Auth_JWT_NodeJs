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
        const message = e?.message || 'Error Server';

        return {
            status, message
        };
    }
}

module.exports = CustomError;