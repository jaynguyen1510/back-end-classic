const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, required: true, default: false },
        phone: { type: String },
        address: { type: String, required: false },
        avatar: { type: String },
        city: { type: String, required: false },

    },
    {
        timestamps: true
    }
);
const User = mongoose.model('User', userSchema);

module.exports = User;