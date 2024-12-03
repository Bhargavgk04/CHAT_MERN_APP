import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./socket/socket.js";
import path from "path";
dotenv.config({});

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Configure CORS to allow both origins
const allowedOrigins = ['https://chat-mern-app-x4j1.onrender.com', 'http://localhost:3000', 'http://localhost:5173'];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true); // Allow the request
            } else {
                callback(new Error('Not allowed by CORS')); // Block the request
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
        credentials: true, // Allow cookies and auth headers
    })
);

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get('*', (_,res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

// Start server
server.listen(PORT, () => {
    connectDB();
    console.log(`Server listening at port ${PORT}`);
});
