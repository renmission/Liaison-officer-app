const mongoose = require('mongoose');
// const mongoosastic = require('mongoosastic');
// const elasticsearch = require('elasticsearch');


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
    myImage: {
        type: String
    },
    slug: {
        type: String
    },
    cardNumber: {
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
    pecWaived: {
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


// const esClient = new elasticsearch.Client({
//     host: 'localhost:3000',
//     log: 'trace',
//     apiVersion: '7.2',
// });

// patientSchema.plugin(mongoosastic, {
//     esClient: esClient
// })


module.exports = mongoose.model('Patient', patientSchema);


