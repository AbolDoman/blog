const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    }
})
const Search = mongoose.model("Search", searchSchema);

module.exports = {
    Search
}