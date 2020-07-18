const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, unique: false, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    created_on: { type: Date, default: Date.now }

});


module.exports = Blog = mongoose.model('Blog', schema);