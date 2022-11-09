const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { userValidationSchema } = require('./validations');
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})
userSchema.statics.userValidation = function(body) {
    return userValidationSchema.validate(body, { abortEarly: false })
}


userSchema.pre("save", async function(next) {
    let user = this;
    if (!user.isModified("password")) {
        next();
    } else {
        const pass = await bcrypt.hash(user.password, 10);
        user.password = pass;
        next();
    }
})

const User = mongoose.model("User", userSchema);

module.exports = {
    User
}