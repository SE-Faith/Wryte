import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["email_verification", "password_reset"],
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

// TTL index to automatically remove expired OTPs from the database
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("OTP", otpSchema);
