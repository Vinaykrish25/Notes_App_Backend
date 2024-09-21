const jwt = require('jsonwebtoken');
const userModel = require('../Models/userModel'); // Adjust the path as necessary

exports.protect = async (req, res, next) => {
    try {
        // Get token from headers
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({
                message: "You are not logged in! Please log in to get access."
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JSON_TOKEN);

        // Check if user still exists
        const currentUser = await userModel.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({
                message: "The user belonging to this token no longer exists."
            });
        }

        // Grant access
        req.user = currentUser;
        next();

    } catch (err) {
        res.status(401).json({
            message: "Invalid token. Please log in again."
        });
    }
};
