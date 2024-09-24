const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const notesRouter = require('./Routes/notesRoute');
const userRouter = require('./Routes/userRouter');
const { protect } = require('./Middlewares/authHandler');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB using environment variable for the connection string
mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((error) => {
        console.error("Database connection error:", error);
    });

const app = express();

// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Enable CORS, allowing requests from your frontend URLs and localhost during development
app.use(cors({
    origin: ["https://notes-app-frontend-rzjm.vercel.app/", "http://localhost:3000"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
}));

// Define your API routes with authentication protection for notes
app.use('/notes', protect, notesRouter);
app.use('/users', userRouter);

// Listen on the port provided by Vercel or default to 5000 during development
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`);
});
