const { body, validationResult } = require('express-validator');

exports.registerValidation = [
    body('name')
        .isLength({ min: 20, max: 60 })
        .withMessage('Name must be between 20 and 60 characters'),
    body('email')
        .isEmail()
        .withMessage('Please include a valid email'),
    body('address')
        .isLength({ max: 400 })
        .withMessage('Address must be at most 400 characters'),
    body('password')
        .isStrongPassword({
            minLength: 8,
            maxLength: 16,
            minUppercase: 1,
            minSymbols: 1
        })
        .withMessage('Password must be 8-16 characters, include 1 uppercase letter and 1 special character'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
