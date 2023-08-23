const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized access." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token." });
        }

        req.user = decoded; // Store the decoded user information in the request object
        next(); // Proceed to the protected route
    });
};

module.exports = { isAuthenticated };
