import nodemailer from "nodemailer";
import User from "../models/userModel.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const sendOtp = async (email) => {

    try {
        // Generate a 6-digit OTP
        const otpCode = crypto.randomInt(100000, 999999).toString();




        // Set up Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is: ${otpCode}. It will expire in 5 minutes.`,
        };
        // Send email
        await transporter.sendMail(mailOptions);

        // Store OTP in MongoDB (replaces existing OTP if present)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            await User.updateOne({ email }, { otpCode });
            return { success: true, message: "OTP sent successfully", _id: existingUser._id };
        } else {
            const newUser = await User.create({ email, otpCode });
            return { success: true, message: "OTP sent successfully", _id: newUser._id };
        }

    } catch (error) {
        return { success: false, message: "Error sending OTP", error, _id: null };
    }
};

export default sendOtp;