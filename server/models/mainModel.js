import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: "",
        required: false,
    },
    status: { type: String, default: "pending" },
    userName: { type: String, required: false, default: "" },
    userMobile: { type: String, required: false, default: "" },
    pricing: { type: String, required: false, default: "" },
    planType: { type: String, required: false, default: "" },
    planName: { type: String, required: false, default: "" },
    isExpired: { type: Boolean, default: false },
    //   userImage: { type: String, default: null }, // Image is optional
    // reqAdmin: { type: Boolean, default: false }, // Admin or not
    // createdAt: { type: Date, default: Date.now }, // Auto timestamp
    requestedTime: { type: Date, default: Date.now() }, // Auto timestamp
    approvedTime: { type: Date, default: Date.now() }, // Auto timestamp
});

const Request = mongoose.model('Request', userSchema);
export default Request;