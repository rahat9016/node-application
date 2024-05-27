const express = require("express");
const router = express.Router();
const { signup, signing, logout } = require("../controller/authControllers")
const { validationSignupRequest, isRequestValidated, validationSigningRequest, isAuthorized } = require("../middlewares/auth")

// Routes
router.post("/signup", validationSignupRequest, isRequestValidated, signup)
router.post("/signing", validationSigningRequest, isRequestValidated, signing)
router.post("/logout", isAuthorized)
module.exports = router