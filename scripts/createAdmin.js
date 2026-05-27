require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/User");

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