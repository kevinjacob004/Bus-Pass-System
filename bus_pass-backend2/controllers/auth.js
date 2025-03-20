// import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import db from "../config/db.js";
import users from "../models/User.js";
const bcrypt = require("bcryptjs");
export const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      courseName,
      semester,
      phoneNo,
      dropoffAddress,
    } = req.body;

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userData = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role: role || "student",
    };
    console.log(userData);
    // Add student specific fields if role is student
    if (role === "student") {
      if (!courseName || !semester || !phoneNo || !dropoffAddress) {
        return res.status(400).json({
          success:false,
          message:
            "Student details (courseName, semester, phoneNo, dropoffAddress) are required",
        });
      }

      Object.assign(userData, {
        courseName,
        semester: parseInt(semester),
        phoneNo,
        dropoffAddress,
        status: "active",
      });
    }

    const [user] = await db.insert(users).values(userData);

    // Create token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      success: true,
      token,
      role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error in signup" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
    // Check if user exists
    const [user] = await db.select().from(users).where(eq(users.email, email));
    console.log(user);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      success: true,
      token,
      id: user.id,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Error in login" });
  }
};
