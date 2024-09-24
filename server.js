const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const notesRouter = require('./Routes/notesRoute');
const userRouter = require('./Routes/userRouter');
const { protect } = require('./Middlewares/authHandler');

dotenv.config();

mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log("Database connected successfully");
});

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["https://notes-app-frontend-theta.vercel.app/", "http://localhost:3000/"],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}))
app.use(cookieParser());
app.use('/notes',protect, notesRouter);
app.use('/users', userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server is running successfully on the port 5000");
});