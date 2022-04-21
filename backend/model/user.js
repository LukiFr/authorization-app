const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        userName: { type: String, required: true },
        passwordHash: { type: String, required: true },
        emailAdress: { type: String, required: true },
        isBlocked: { type: Boolean, required: true, default: false },
        registrationTime: { type: Date, required: true },
        lastLoginTime: { type: Date, required: true, default: Date(1970, 0, 0, 0, 0, 0) }
    },
    { collection: 'users' }
)

const model = mongoose.model('UserSchema', UserSchema)

module.exports = model