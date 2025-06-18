const jwt = require('jsonwebtoken');
const userModel = require('../Models/userModel');

// Function to generate a JWT token
const generateToken = (id, username, email) => {
    return jwt.sign({ id, username, email }, process.env.JSON_TOKEN, { expiresIn: "1h" });
};

// Register a new user 
exports.registerUser = async (req, res, next) => {
    try {
        const { username, email, password, confirmpassword } = req.body;

        // Password match validation
        if (password !== confirmpassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Check if the user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use." });
        }

        // Create the user (password will be hashed automatically)
        const newUser = await userModel.create({ username, email, password });

        res.status(201).json({
            status: "success",
            data: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
            message: "Registered Successfully. Please log in."
        });
    } catch (err) {
        next(err);
    }
};


// Login user
exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare provided password with stored hashed password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate a token
        const token = generateToken(user._id, user.username, user.email);

        // Set JWT in cookies
        res.cookie('jwt', token, { maxAge: 3600000, httpOnly: true,  
        secure: true, // required for HTTPS (Vercel)
        sameSite: 'None', }); // important for cross-site cookies 
        
        res.status(200).json({
            message: "Login successful",
            data: {
                username: user.username,
                email: user.email,
            }
        });
    } catch (err) {
        next(err);
    }
};

// Verify authenticated user
exports.verifyUser = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: "Token not found or invalid" });
    }
    try {
        const decodedData = jwt.verify(token, process.env.JSON_TOKEN);
        res.status(200).json({ 
            status: "success", 
            data: decodedData,
            message: "Verified user" 
        });
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Logout user
exports.logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        secure: true, // important for Vercel
        sameSite: 'None',
        expires: new Date(0),  // expire immediately
        path: '/'              // ensure path matches the login cookie
    });
    res.status(200).json({
        message: "Logout successful"
    });
};

// Get all users
exports.getAllUser = async (req, res, next) => {
    try {
        const showUsers = await userModel.find();
        res.status(200).json({
            status: "success",
            data: showUsers,
        });
    } catch (err) {
        next(err);
    }
};
