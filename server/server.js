import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose"

import authRouter from "./routes/Auth.js";
import eventRouter from "./routes/Event.js";
import inviteRouter from "./routes/Invite.js";
import userRouter from "./routes/User.js";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)
        console.log('Successfully connected to Database!')
    }
    catch (err) {
        console.log(err.message)
    }
}

connectDB()

const PORT = process.env.PORT || 5500;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true, methods: ['POST'] }));

app.use(authRouter);
app.use(eventRouter);
app.use(inviteRouter);
app.use(userRouter);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));