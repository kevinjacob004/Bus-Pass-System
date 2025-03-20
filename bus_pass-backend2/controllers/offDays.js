import db from '../config/db.js';
// import { v4 as uuidv4 } from 'uuid';
import OffDays from '../models/OffDays.js';
// import { eq } from 'drizzle-orm';
const eq = require("drizzle-orm");
const { v4: uuidv4 } = require("uuid");

export const getAllOffDays = async (req, res) => {
  try {
    const offDays = await db.select().from(OffDays);
    res.json({ success: true, data: offDays });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getOffDayById = async (req, res) => {
  try {
    const offDay = await db.select().from(OffDays).where(eq(OffDays.id, req.params.id));
    if (offDay.length === 0) {
      return res.status(404).json({ success: false, error: 'Off day not found' });
    }
    res.json({ success: true, data: offDay[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createOffDay = async (req, res) => {
  try {
    const { semester, branch, offDate } = req.body;
    const newOffDay = {
      id: uuidv4(),
      semester,
      branch,
      offDate: new Date(offDate),
    };
    await db.insert(OffDays).values(newOffDay);
    res.status(201).json({ success: true, data: newOffDay });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateOffDay = async (req, res) => {
  try {
    const { semester, branch, offDate } = req.body;
    const updateData = {
      ...(semester && { semester }),
      ...(branch && { branch }),
      ...(offDate && { offDate: new Date(offDate) }),
    };
    
    await db.update(OffDays)
      .set(updateData)
      .where(eq(OffDays.id, req.params.id));
    
    res.json({ success: true, data: { message: 'Off day updated successfully' } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteOffDay = async (req, res) => {
  try {
    await db.delete(OffDays).where(eq(OffDays.id, req.params.id));
    res.json({ success: true, data: { message: 'Off day deleted successfully' } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};