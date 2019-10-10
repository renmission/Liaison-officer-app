const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hospitalSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('hospitals', hospitalSchema);