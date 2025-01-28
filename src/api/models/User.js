const mongoose = require( 'mongoose' );

const ROLES = {
    admin: 1000,
    user: 2000
};

const UserSchema = new mongoose.Schema( {
    username: {
        type: String,
        required: true,
        minLength: 3,
        unique: true
    },
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
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        minLength: 10,
        unique: true
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
        default: [ROLES.user],
        validate: {
            validator: roles => {
                const validRoles = Object.values( ROLES );
                return roles.includes( ROLES.user ) && roles.every( role => validRoles.includes( role ) );
            },
            message: props => `Error in roles : "${props.value}". Roles must contain user rights "${ROLES.user}" and add only admin rights "${ROLES.admin}"`
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