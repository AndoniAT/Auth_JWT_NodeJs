const mongoose = require( 'mongoose' );

const ROLES = {
    admin: 1000,
    user: 2000
};

const UserSchema = new mongoose.Schema( {
    firstname: {
        type: String,
        required: true,
        minLength: 3
    },
    lastname: {
        type: String,
        required: true,
        minLength: 3
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    email: {
        type: String,
        minLenght: 10,
        required: true,
        lowercase: true,
    },
    createdAt: {
        type: Date,
        immutable: true,
        required: true,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        required: true,
        default: () => Date.now()
    },
    roles: {
        type: [Number],
        default: [ ROLES.user ],
        validate: {
            validator: roles => Object.values( ROLES ).some( role => roles.includes( role ) ),
            message: props => `${props.value} is not a valid role`
        }
    },
    refreshToken: {
        type: [String],
        default: []
    }
} );

const User = mongoose.model( 'User', UserSchema );
module.exports = {
    User,
    Roles: ROLES
};