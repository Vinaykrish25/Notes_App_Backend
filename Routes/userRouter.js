const express = require('express');
const { getAllUser, registerUser, loginUser, logoutUser, verifyUser } = require('../Controllers/userController');
const { protect } = require('../Middlewares/authHandler');
const userRouter = express.Router();

userRouter.get('/', getAllUser);
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);
userRouter.post('/verify',protect, verifyUser);

module.exports = userRouter;