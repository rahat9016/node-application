const express = require("express");
const router = express.Router()
const { validationSignupRequest, validationSigningRequest, isRequestValidated } = require("../../middleware/auth");
const { signup, signing } = require("../../controller/user/User");


// sing-up
router.post("/signup", validationSignupRequest, isRequestValidated, signup)
// signing
router.post("/signing", validationSigningRequest, isRequestValidated, signing)

module.exports = router