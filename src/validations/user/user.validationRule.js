import { check, body } from "express-validator";

// sign up validation rules ...
export const signUpValidationRules = () => [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("**Name should not be empty")
        .isLength({ min: 3, max: 31 })
        .withMessage('**Name Should be atleast 3 to 31 characters long')
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('**Name should contain only alphabetic characters and spaces'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('**email should not empty')
        .isEmail()
        .withMessage('**Invalid Email Id'),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("**Password should not be empty")
        .isLength({ min: 6, max: 8 })
        .withMessage('**password should be minimum 8 characters and maximum 8 characters')
        .matches(/[A-Z]/)
        .withMessage('**Password should contain atleast one Uppercase character')
        .matches(/[a-z]/)
        .withMessage('**Password should contain atleast one lowercase character')
        .matches(/\d/)
        .withMessage('**Password should contain atleast one digit')
        .matches(/[@$!%*?&#]/)
        .withMessage('**Password should contain atleast one special characters: (@, $, !, %, *, ?, &, #)'),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("**Address should not be empty")
        .isLength({ min: 3 })
        .withMessage("**Address should be atleast 3 characters"),

    body("isAdmin")
        .optional()
        .isBoolean()
        .withMessage("**isAdmin field should be type of Boolean"),

    body("isBanned")
        .optional()
        .isBoolean()
        .withMessage("**isBanned field should be type of Boolean"),
];



// sign up validation rules ...
export const otpValidationRules = () => [
    check('email')
        .trim()
        .notEmpty()
        .withMessage('**email should not empty')
        .isEmail()
        .withMessage('**Invalid Email Id'),

    check("password")
        .trim()
        .notEmpty()
        .withMessage("**Password should not be empty")
        .isLength({ min: 6, max: 8 })
        .withMessage('**password should be minimum 8 characters and maximum 8 characters')
        .matches(/[A-Z]/)
        .withMessage('**Password should contain atleast one Uppercase character')
        .matches(/[a-z]/)
        .withMessage('**Password should contain atleast one lowercase character')
        .matches(/\d/)
        .withMessage('**Password should contain atleast one digit')
        .matches(/[@$!%*?&#]/)
        .withMessage('**Password should contain atleast one special characters: (@, $, !, %, *, ?, &, #)'),
];


// sign up validation rules ...
export const signInValidationRules = () => [
    check('email')
        .trim()
        .notEmpty()
        .withMessage('**email should not empty')
        .isEmail()
        .withMessage('**Invalid Email Id'),

    check("otp")
        .trim()
        .notEmpty()
        .withMessage("**OTP must be required")
        .isLength({ min: 6, max: 6 })
        .withMessage('**OTP should be exactly 6 characters long')
];