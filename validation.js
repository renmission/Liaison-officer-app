const Joi = require('@hapi/joi');

const patientValidation = (data) => {
    const schema = Joi.object({
        hospital: Joi.required(),
        name: Joi.required(),
        room: Joi.required(),
        details: Joi.required()
    });

    return schema.validate(data);
}

module.exports.patientValidation = patientValidation;