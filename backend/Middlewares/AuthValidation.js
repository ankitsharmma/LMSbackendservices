const Joi = require('joi');

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string()
            .pattern(/^[0-9]{10,15}$/)
            .required()
            .messages({ 'string.pattern.base': 'Phone number must be valid' }),
        address: Joi.string().min(3).max(200).required(),
        password: Joi.string().min(6).max(100).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
            .messages({ 'any.only': 'Confirm password must match password' })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Bad request", error: error.details[0].message });
    }
    next();
};

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(100).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Bad request", error: error.details[0].message });
    }
    next();
};

const getuservalidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().optional()
    });

    const { error } = schema.validate(req.query);
    if (error) {
        return res.status(400).json({ message: "Bad request", error: error.details[0].message });
    }
    next();
};
const updateUserValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).optional(),
        email: Joi.string().email().optional(),
        phoneNumber: Joi.string()
            .pattern(/^[0-9]{10,15}$/)
            .optional()
            .messages({ 'string.pattern.base': 'Phone number must be valid' }),
        address: Joi.string().min(3).max(200).optional(),
        password: Joi.string().min(6).max(100).optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Bad request", error: error.details[0].message });
    }
    next();
};

const deleteUserValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Bad request", error: error.details[0].message });
    }
    next();
};
module.exports = {
    signupValidation,
    loginValidation,
    getuservalidation,
    updateUserValidation,
    deleteUserValidation
};
