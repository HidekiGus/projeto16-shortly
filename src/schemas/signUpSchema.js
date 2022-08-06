import joi from "joi";

const signUpSchema = joi.object({
    name: joi.string().required(),
    email: joi.email().required(),
    password: joi.string.required(),
    confirmPassword: joi.string().required()
});

export default signUpSchema;