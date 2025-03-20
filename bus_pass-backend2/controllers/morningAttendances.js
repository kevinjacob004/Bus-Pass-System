// import { eq } from 'drizzle-orm';
const {eq} = require("drizzle-orm");
const {v4: uuidv4}=require("uuid");
import  db from '../config/db.js';
import MorningAttendance from '../models/MorningAttendance.js';
import Route from '../models/Route.js';
import Bus from '../models/Bus.js';
// import { v4 as uuidv4 } from 'uuid';

// @desc    Get all morning attendance records
// @route   GET /api/morning-attendance
// @access  Private/Admin
export const getAllMorningAttendance = async (req, res) => {
  try {
    const records = await db
      .select({
        id: MorningAttendance.id,
        date: MorningAttendance.date,
        routeId: MorningAttendance.routeId,
        busId: MorningAttendance.busId,
        count: MorningAttendance.count,
        routeName: Route.routeName,
        busNo: Bus.busNo,
        maxSeatCapacity: Bus.maxSeatCapacity
      })
      .from(MorningAttendance)
      .leftJoin(Route, eq(MorningAttendance.routeId, Route.id))
      .leftJoin(Bus, eq(MorningAttendance.busId, Bus.id));

    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single morning attendance record
// @route   GET /api/morning-attendance/:id
// @access  Private/Admin
export const getMorningAttendanceById = async (req, res) => {
  try {
    const record = await db
      .select({
        id: MorningAttendance.id,
        date: MorningAttendance.date,
        routeId: MorningAttendance.routeId,
        busId: MorningAttendance.busId,
        count: MorningAttendance.count,
        routeName: Route.routeName,
        busNo: Bus.busNo,
        maxSeatCapacity: Bus.maxSeatCapacity
      })
      .from(MorningAttendance)
      .leftJoin(Route, eq(MorningAttendance.routeId, Route.id))
      .leftJoin(Bus, eq(MorningAttendance.busId, Bus.id))
      .where(eq(MorningAttendance.id, req.params.id));

    if (!record.length) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }

    res.status(200).json({ success: true, data: record[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create morning attendance record
// @route   POST /api/morning-attendance
// @access  Private/Admin
export const addMorningAttendance = async (req, res) => {
  try {
    const { date, routeId, busId, count } = req.body;

    const newRecord = {
      id: uuidv4(),
      date: new Date(date),
      routeId,
      busId,
      count
    };

    await db.insert(MorningAttendance).values(newRecord);
    res.status(201).json({ success: true, data: newRecord });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update morning attendance record
// @route   PUT /api/morning-attendance/:id
// @access  Private/Admin
export const updateMorningAttendance = async (req, res) => {
  try {
    const { date, routeId, busId, count } = req.body;
    
    const record = await db
      .select()
      .from(MorningAttendance)
      .where(eq(MorningAttendance.id, req.params.id));

    if (!record.length) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }

    await db
      .update(MorningAttendance)
      .set({ 
        date: date ? new Date(date) : undefined,
        routeId,
        busId,
        count 
      })
      .where(eq(MorningAttendance.id, req.params.id));

    const updatedRecord = await db
      .select()
      .from(MorningAttendance)
      .where(eq(MorningAttendance.id, req.params.id));

    res.status(200).json({ success: true, data: updatedRecord[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete morning attendance record
// @route   DELETE /api/morning-attendance/:id
// @access  Private/Admin
export const deleteMorningAttendance = async (req, res) => {
  try {
    const record = await db
      .select()
      .from(MorningAttendance)
      .where(eq(MorningAttendance.id, req.params.id));

    if (!record.length) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }

    await db
      .delete(MorningAttendance)
      .where(eq(MorningAttendance.id, req.params.id));

    res.status(200).json({ 
      success: true, 
      data: { message: 'Morning attendance record deleted successfully' }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};