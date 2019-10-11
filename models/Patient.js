const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const patientSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'hospitals'
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
        type: String,
    },
    dateOfAdmissionTo: {
        type: String,
    },
    myImage: {
        type: String
    },
    slug: {
        type: String
    },
    cardNum: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    birthday: {
        type: String,
        required: true
    },
    principal: {
        type: String,
        required: true
    },
    principalBirthday: {
        type: String,
        required: true
    },
    className: {
        type: String,
        required: true
    },
    plan: {
        type: String,
        required: true
    },
    roomAndBoardAllowance: {
        type: String,
        required: true
    },
    shs: {
        type: String,
        required: true
    },
    util: {
        type: String,
        required: true
    },
    exp: {
        type: String,
        required: true
    },
    fdx: {
        type: String,
        required: true
    },
    pecWaived: {
        type: String,
    },
    ghb: {
        type: String,
        required: true
    },
    phic: {
        type: String,
        required: true
    },
    doctor: {
        type: String,
        required: true
    },
    alga: {
        type: String,
        required: true
    },
    additionalDetails: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('Patient', patientSchema);


