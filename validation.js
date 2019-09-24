const Joi = require('@hapi/joi');

const patientValidation = (data) => {
    const schema = Joi.object({
        hospital: Joi.required(),
        name: Joi.required(),
        room: Joi.required(),
        category: Joi.required(),
        details: Joi.required()
    });

    return schema.validate(data);
}

const patientValidationTwo = (data) => {
    const schema = Joi.object({
        category: Joi.required(),
        details: Joi.required()
    });

    return schema.validate(data);
}

const categoryValidation = (data) => {
    const schema = Joi.object({
        name: Joi.required()
    });
    return schema.validate(data);
}

module.exports.patientValidation = patientValidation;
module.exports.patientValidationTwo = patientValidationTwo;
module.exports.categoryValidation = categoryValidation;