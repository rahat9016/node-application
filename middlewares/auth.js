const { check, validationResult } = require("express-validator")
const User = require("../model/Auth")

// Validation Signup Request 
exports.validationSignupRequest = [
    check("fullName").notEmpty().withMessage("Full name is required!").trim(),
    // check("lastName").notEmpty().withMessage("Last name is required!").trim(),
    check('email').trim().custom( async (value)=> {
        const user = await User.findOne({email: value})
        if(user) throw new Error("Email already use!")
    }),
    check("phone").notEmpty().withMessage("Phone number is required!").isLength({min: 11}).withMessage("Phone number must be at least 11 chars long").notEmpty().custom(async (value)=> {
        const user = await User.findOne({phone: value});
        if(user) throw new Error ("Phone number already exits!")
    }),
    check("password").notEmpty().withMessage("Password is required!").isLength({min: 6}).withMessage("Password must be at least 6 chars long")
]

// 
exports.validationSigningRequest = [
    check('email').trim(),
    check("phone").notEmpty().withMessage("Phone number is required!").isLength({min: 11}).withMessage("Phone number must be at least 11 chars long").notEmpty(),
    check("password").notEmpty().withMessage("Password is required!").isLength({min: 6}).withMessage("Password must be at least 6 chars long")
]
exports.isRequestValidated = (req,res,next) => {
    const errors = validationResult(req);
    // console.log(errors)
    const mappedErrors = errors.mapped()
    // console.log(mappedErrors)
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

}