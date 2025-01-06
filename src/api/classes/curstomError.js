class CustomError extends Error {
    status;

    constructor( msg, status ) {
        super( msg );
        this.status = status;
        Object.setPrototypeOf( this, CustomError.prototype );
    }
}

module.exports = CustomError;