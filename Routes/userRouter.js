const express = require('express');
const { getAllUser, registerUser, loginUser, logoutUser, verifyUser } = require('../Controllers/userController');
const userRouter = express.Router();

userRouter.get('/', getAllUser);
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);
userRouter.post('/verify', verifyUser);

module.exports = userRouter;