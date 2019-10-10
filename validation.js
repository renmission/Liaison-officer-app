const Joi = require('@hapi/joi');

const patientValidation = (data) => {
    const schema = Joi.object({
        hospital: Joi.string().required(),
        category: Joi.string().required(),
        name: Joi.string().required(),
        room: Joi.number().required(),
        dateOfAdmission: Joi.string().required(),
        dateOfAdmissionTo: Joi.string().required(),
        cardNum: Joi.number().required(),
        company: Joi.string().required(),
        birthday: Joi.string().required(),
        principal: Joi.string().required(),
        principalBirthday: Joi.string().required(),
        className: Joi.string().required(),
        plan: Joi.string().required(),
        roomAndBoardAllowance: Joi.number().required(),
        shs: Joi.string().required(),
        util: Joi.number().required(),
        exp: Joi.string().required(),
        fdx: Joi.string().required(),
        ghb: Joi.string().required(),
        phic: Joi.string().required(),
        doctor: Joi.number().required(),
        alga: Joi.number().required(),
        additionalDetails: Joi.string().required()
    });

    return schema.validate(data);
}

const patientValidationTwo = (data) => {
    const schema = Joi.object({
        category: Joi.string().required(),
    });

    return schema.validate(data);
}

const categoryValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().required()
    });
    return schema.validate(data);
}

const hospitalValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().required()
    });
    return schema.validate(data);
}

const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(6).required(),
        password2: Joi.valid(Joi.ref('password')).required().label('Confirm Password')
    });
    return schema.validate(data);
}

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
}

module.exports.patientValidation = patientValidation;
module.exports.patientValidationTwo = patientValidationTwo;
module.exports.categoryValidation = categoryValidation;
module.exports.hospitalValidation = hospitalValidation;
module.exports.loginValidation = loginValidation;
module.exports.registerValidation = registerValidation;