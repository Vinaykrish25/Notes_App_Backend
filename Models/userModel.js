const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username should not be empty"],
        minLength: [3, "Username length should be at least 3"],
        maxLength: [15, "Username length should be at most 15"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email should not be empty"],
        minLength: [3, "Email length should be at least 3"],
        maxLength: [40, "Email length should be at most 40"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password should not be empty"],
        minLength: [8, "Password length should be at least 8"],
        maxLength: [15, "Password length should be at most 15"]
    }
}, { collection: "users" });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
// Method to validate password
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
