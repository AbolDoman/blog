const mongoose = require('mongoose');
const { User } = require('./usersSchema');
const { postValidationSchema } = require('./postValidation');
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255,
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        default: "public",
        enum: ["public", "private"]
    },
    thumbnail: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})
postSchema.index({ title: "text" });


postSchema.statics.postValidation = function(body) {
    return postValidationSchema.validate(body, { abortEarly: false })
}


const Post = mongoose.model("Post", postSchema);

module.exports = {
    Post
}