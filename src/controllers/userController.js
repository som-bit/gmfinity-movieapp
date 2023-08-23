const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


// // Set the JWT token as a cookie
// const cookieOptions = {
//     httpOnly: true, // Prevent JavaScript access to the cookie
//     expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // Cookie expiration time (1 hour in this case)
//     // secure: process.env.NODE_ENV === 'production', // Set to true in production to ensure cookies are only sent over HTTPS
// };




//Signup Function
const signUp = async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Please Provide Required Information",
        });
    }

    const hash_password = await bcrypt.hash(password, 10);

    const userData = {
        firstName,
        lastName,
        username,
        email,
        hash_password,
    };

    const user = await User.findOne({ email });
    if (user) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "User already registered",
        });
    } else {
        User.create(userData).then((data, err) => {
            if (err) res.status(StatusCodes.BAD_REQUEST).json({ err });
            else
                res
                    .status(StatusCodes.CREATED)
                    .json({ message: "User created Successfully " });
            console.log("User created Successfully ");
        });

    }
};




//SignIn function
const signIn = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Please enter email and password",
            });
        }

        const user = await User.findOne({ email: req.body.email });

        if (user) {
            if (user.authenticate(req.body.password)) {
                const token = jwt.sign(
                    { _id: user._id },
                    process.env.JWT_SECRET, { expiresIn: "30d" });
                const { _id, firstName, lastName, username, email, hash_password } = user;
                console.log("reached here ");
                req.session._id = user._id;
                console.log("req.session.userId: ", req.session._id);
                res.status(StatusCodes.OK).json({
                    token,
                    user: { _id, firstName, lastName, username, email, hash_password },
                    message: "User Logged in Successfully ",
                    redirectTo: 'http://localhost:5500/home.html'
                });

                console.log("User Loggedin Successfully ");


            } else {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: "Something went wrong!",
                });
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "User does not exist..!",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.BAD_REQUEST).json({ error });
    }
};
module.exports = { signUp, signIn };