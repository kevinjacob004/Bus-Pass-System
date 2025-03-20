import express from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/users.js';

const router = express.Router();

// Get all users (protected, admin only)
router.get('/', getAllUsers);

// Get user by ID (protected, admin or same user)
router.get('/:id', getUserById);

// Create new user (protected, admin only)
router.post('/', createUser);

// Update user (protected, admin or same user)
router.put('/:id', updateUser);

// Delete user (protected, admin only)
router.delete('/:id', deleteUser);

export default router;
