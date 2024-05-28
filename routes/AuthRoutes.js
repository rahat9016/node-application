const express = require("express");
const router = express.Router();
const { signup, signing, logout } = require("../controller/authControllers")
const { validationSignupRequest, isRequestValidated, validationSigningRequest, isAuthorized, isAdmin } = require("../middlewares/auth")

// Routes
router.post("/signup", validationSignupRequest, isRequestValidated, signup)
router.post("/signing", validationSigningRequest, isRequestValidated, signing)
router.post("/logout", isAuthorized, isAdmin, (req,res)=> {
    res.send("ok")
})
module.exports = router