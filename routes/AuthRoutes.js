const express = require("express");
const router = express.Router();
const { signup, signing } = require("../controller/authControllers")
const { validationSignupRequest, isRequestValidated, validationSigningRequest } = require("../middlewares/auth")

// Routes
router.post("/signup", validationSignupRequest, isRequestValidated, signup)
router.post("/signing", validationSigningRequest, isRequestValidated, signing)
module.exports = router