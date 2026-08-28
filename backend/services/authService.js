import User from "../models/User.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/sendMail.js";

class AuthServices {
    async register(data) {
        const { name, email, password, role } = data;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        // Create random 6-digit OTP for email verification
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save to database with 150s TTL
        await OTP.deleteMany({ email, type: "email_verification" });
        await OTP.create({
            email,
            code,
            type: "email_verification",
            expiresAt: new Date(Date.now() + 150 * 1000)
        });

        try {
            await sendMail(email, "Wryte - Verify Your Email", `Welcome to Wryte! Your email verification OTP is: ${code}`);
        } catch (err) {
            console.log("Email verification code sending failed. Code is:", code);
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        return { user, token, verificationCode: code };
    }

    async login(data) {
        const { email, password } = data;
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            throw new Error("Invalid Email");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Invalid Email or password");
        }

        if (!user.isActive) {
            throw new Error("Account is inactive. Please verify your email first.");
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        return { user, token };
    }

    async changePassword(userId, currentPassword, newPassword) {
        const user = await User.findById(userId).select("+password");
        if (!user) {
            throw new Error("User not found");
        }
       
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid current password");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();  
        
        return user;
    }

    async forgotPassword(email) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("No user found with this email");
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Context-aware logic: if the user is unverified (isActive: false), resending OTP is for email verification.
        // Otherwise, it is for password reset.
        const type = user.isActive ? "password_reset" : "email_verification";
        const emailSubject = user.isActive ? "Wryte - Reset Password Code" : "Wryte - Verify Your Email";
        const emailBody = user.isActive 
            ? `Your password reset code is: ${code}`
            : `Welcome to Wryte! Your email verification OTP is: ${code}`;

        await OTP.deleteMany({ email, type });
        await OTP.create({
            email,
            code,
            type,
            expiresAt: new Date(Date.now() + 150 * 1000)
        });

        try {
            await sendMail(email, emailSubject, emailBody);
        } catch (err) {
            console.log("Email code sending failed. Code is:", code);
        }
        return { email, code };
    }

    async resetPassword(token, newPassword) {
        const otpRecord = await OTP.findOne({
            code: token,
            type: "password_reset",
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            throw new Error("Invalid or expired reset code");
        }

        const email = otpRecord.email;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        await OTP.deleteMany({ email, type: "password_reset" });

        return user;
    }

    async verifyEmail(email, code) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }

        const otpRecord = await OTP.findOne({
            email,
            code,
            type: "email_verification",
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            throw new Error("Invalid or expired verification code");
        }

        user.isActive = true;
        await user.save();

        await OTP.deleteMany({ email, type: "email_verification" });

        return user;
    }
}

export default new AuthServices();