const express = require("express");
const router = express.Router();
const { signUp, signIn } = require("../controllers/auth");
const {
    isRequestValidated,
    validateSignUpRequest,
    validateSignIpRequest,
} = require("../validators/auth");


router.route("/signin").post(validateSignIpRequest, isRequestValidated, signIn);


router.route("/signup").post(validateSignUpRequest, isRequestValidated, signUp);


module.exports = router;