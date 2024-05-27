const { check, validationResult } = require("express-validator")
const User = require("../model/User")
const jwt = require("jsonwebtoken")
// Validation Signup Request 
exports.validationSignupRequest = [
    check('fullName', 'Full name is required').not().isEmpty(),
    check('email', 'Please provide a valid email').isEmail().optional(),
    check('phone', 'Phone Number is required').isMobilePhone(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
]
// Validation Signing Request
exports.validationSigningRequest = [
    check('email', 'Please provide a valid email').isEmail().optional(),
    check('phone', 'Phone Number is required').isMobilePhone(),
    check('password', 'Password is required').exists()
]
// If requested API has Errors
exports.isRequestValidated = (req,res,next) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped()

    if(Object.keys(mappedErrors).length === 0) {
        next()
    }else{
        const filteredErrors = Object.keys(mappedErrors).reduce((acc, key) => {
            acc[key] = mappedErrors[key].msg ;
            return acc;
        }, {});
        
        res.status(500).json({
            status: 500,
            errors: filteredErrors
        })
    }
}

exports.isAuthorized = async (req, res, next) => {
    console.log(req.headers.authorization)
    // let token;

    // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    //     token = req.headers.authorization.split(' ')[1];
    // }

    // if (!token) {
    //     return res.status(401).json({ message: 'Not authorized, no token' });
    // }

    // try {
    //     const decoded = jwt.verify(token, process.env.SECURITY_KEY);
    //     console.log({decoded})
    //     req.user = await User.findById(decoded.id).select('-password');
    //     next();
    // } catch (err) {
    //     if (err.name === 'TokenExpiredError') {
    //         return res.status(401).json({ message: 'Token expired' });
    //     } else {
    //         return res.status(401).json({ message: 'Not authorized, token failed' });
    //     }
    // }
}