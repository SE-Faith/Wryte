import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";

mongoose.connect(process.env.MONGO_URI);

async function createAdmin() {
  try {
    const adminExists =
      await User.findOne({
        email: process.env.ADMIN_EMAIL,
      });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword =
      await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        10
      );

    await User.create({
      name: "admin",
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
      isActive: true,
      isVerified: true,
    });

    console.log("Admin created");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

createAdmin();