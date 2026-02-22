import Joi from 'joi';

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('patient', 'doctor', 'admin').required()
});

export const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('patient', 'doctor', 'admin').required(),
    specialization: Joi.string().when('role', { is: 'doctor', then: Joi.required() }),
    experienceYears: Joi.number().when('role', { is: 'doctor', then: Joi.required() }),
    consultationFee: Joi.number().when('role', { is: 'doctor', then: Joi.required() }),
    licenseNumber: Joi.string().when('role', { is: 'doctor', then: Joi.required() }),
    profileImage: Joi.string().allow(null, '')
});

export const appointmentSchema = Joi.object({
    doctorId: Joi.number().required(),
    appointmentDate: Joi.string().isoDate().required(),
    appointmentTime: Joi.string().regex(/^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)?$/).required(),
    reasonForVisit: Joi.string().required(),
    symptoms: Joi.string().allow(null, ''),
    is_virtual: Joi.boolean().default(false)
});
