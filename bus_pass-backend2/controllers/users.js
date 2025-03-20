// import { eq, sql } from "drizzle-orm";
// import { v4 as uuidv4 } from "uuid";
const { eq, sql } = require("drizzle-orm");
const { v4: uuidv4 } = require("uuid");
import db from "../config/db.js";
import users from "../models/User.js";
import { getPaginationData, getPaginationParams } from "../utils/pagination.js";
const bcrypt = require("bcryptjs");

export const getAllUsers = async (req, res) => {
  try {
    const { limit, offset, pageNo, itemsPerPage } = getPaginationParams(
      req.query
    );
    const { role } = req.query;

    // Get total count
    const [{ count }] = await db.select({ count: sql`count(*)` }).from(users);

    // Get paginated users
    const allUsers = await db
      .select()
      .from(users)
      .where(role ? eq(users.role, role) : null)
      .limit(limit)
      .offset(offset);

    // Format user data based on role
    const formattedUsers = allUsers.map((user) => {
      const baseUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      // Add student specific fields if user is a student
      if (user.role === "student") {
        Object.assign(baseUser, {
          courseName: user.courseName,
          semester: user.semester,
          phoneNo: user.phoneNo,
          dropoffAddress: user.dropoffAddress,
          status: user.status,
        });
      }

      return baseUser;
    });

    res.json({
      success: true,
      data: {
        users: formattedUsers,
        pagination: getPaginationData(count, pageNo, itemsPerPage),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Error fetching users" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.params.id));

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Add student specific fields if user is a student
    if (user.role === "student") {
      Object.assign(userData, {
        courseName: user.courseName,
        semester: user.semester,
        phoneNo: user.phoneNo,
        dropoffAddress: user.dropoffAddress,
        status: user.status,
        isDayScholar: user.isDayScholar,
      });
    }

    res.json({
      success: true,
      data: userData,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Error fetching user" });
  }
};

export const createUser = async (req, res) => {
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
      routeId,
      isDayScholar,
    } = req.body;

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = uuidv4();

    // Create user
    await db.insert(users).values({
      id: userId,
      name,
      email,
      password: hashedPassword,
      role: role || "student",
      courseName,
      semester,
      phoneNo,
      dropoffAddress,
      isDayScholar,
      routeId,
      status: "active",
    });

    // Fetch the created user
    const [newUser] = await db.select().from(users).where(eq(users.id, userId));

    // Remove password from response
    delete newUser.password;

    res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Error creating user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      password,
      role,
      courseName,
      semester,
      phoneNo,
      dropoffAddress,
      routeId,
      status,
      isDayScholar,
    } = req.body;

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    if (!existingUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // If email is being changed, check if new email already exists
    if (email && email !== existingUser.email) {
      const [userWithEmail] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      if (userWithEmail) {
        return res
          .status(400)
          .json({ success: false, error: "Email already in use" });
      }
    }

    // Prepare update data
    const updateData = {
      name,
      email,
      role,
      courseName,
      semester,
      phoneNo,
      dropoffAddress,
      routeId,
      status,
      isDayScholar,
    };

    // Only hash and update password if it's provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    // Update user
    await db.update(users).set(updateData).where(eq(users.id, id));

    // Fetch the updated user
    const [updatedUser] = await db.select().from(users).where(eq(users.id, id));

    // Remove password from response
    delete updatedUser.password;

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Error updating user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    if (!existingUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Delete user
    await db.delete(users).where(eq(users.id, id));

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Error deleting user" });
  }
};
