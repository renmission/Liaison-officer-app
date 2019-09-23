const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
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
    slug: {
        type: String
    }

});

module.exports = Patient = mongoose.model('Patient', patientSchema);