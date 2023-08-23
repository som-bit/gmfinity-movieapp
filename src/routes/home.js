const express = require("express");
const router = express.Router();
const { signUp, signIn } = require("../controllers/userController");
const {
   
} = require("../middleware/authMiddleware.js");


// Home screen route
router.get("/home", isAuthenticated, (req, res) => {
    // You can customize this response to render your home screen HTML, JSON, or any other content.
    res.json({ message: "Welcome to the home screen!" });
});