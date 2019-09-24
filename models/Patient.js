const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const patientSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    hospital: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    dateOfAdmission: {
        type: Date,
        default: Date.now
    },
    details: {
        type: String,
        required: true
    },
    myImage: {
        type: String
    },
    slug: {
        type: String
    }

});

module.exports = Patient = mongoose.model('Patient', patientSchema);