// import { eq, and } from "drizzle-orm";
// import { v4 as uuidv4 } from "uuid";
const {eq, and} = require("drizzle-orm");
const {v4: uuidv4}=require("uuid");
import db from "../config/db.js";
import DailyPass from "../models/DailyPass.js";
import Bus from "../models/Bus.js";
import { calculateVacantSeats } from "../utils/seatCalculations.js";
import RouteStop from "../models/RouteStop.js";
import User from "../models/User.js";

export const createBooking = async (req, res) => {
  try {
    const { travelDate, tripTime, stopId, routeId, price } = req.body;

    // Validate required fields
    if (!travelDate || !tripTime || !stopId || !routeId || !price) {
      return res.status(400).json({
        success: false,
        error:
          "Please provide travelDate, tripTime, stopId, routeId, and price",
      });
    }

    // Get bus details for the route
    const bus = await db
      .select()
      .from(Bus)
      .where(eq(Bus.routeId, routeId))
      .limit(1);

    if (!bus || bus.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No bus found for this route",
      });
    }

    // Check seat availability
    const seatInfo = await calculateVacantSeats({
      routeId,
      tripTime,
      travelDate,
      maxSeatCapacity: bus[0].maxSeatCapacity,
    });

    if (seatInfo.vacantSeats <= 0) {
      return res.status(400).json({
        success: false,
        error: "No vacant seats available for this route and time",
      });
    }

    const newDailyPass = {
      id: uuidv4(),
      travelDate,
      tripTime,
      stopId,
      routeId,
      price,
      ticketNo: await generateNextTicketNo(),
      userId: req.user.id,
      paymentStatus: "pending_payment",
      isBooked: true,
    };

    async function generateNextTicketNo() {
      const [latestPass] = await db
        .select()
        .from(DailyPass)
        .orderBy("ticket_no", "desc")
        .limit(1);

      if (!latestPass) {
        return 1;
      } else {
        return latestPass.ticketNo + 1;
      }
    }

    await db.insert(DailyPass).values(newDailyPass);

    res.status(201).json({
      success: true,
      data: newDailyPass,
    });
  } catch (error) {
    console.error("Error creating daily pass booking:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getAllDailyPasses = async (req, res) => {
  try {
    const passes = await db.select().from(DailyPass);
    res.json({ success: true, data: passes });
  } catch (error) {
    console.error("Error fetching daily passes:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUserDailyPasses = async (req, res) => {
  try {
    const userPasses = await db
      .select()
      .from(DailyPass)
      .where(eq(DailyPass.userId, req.user.id));

    res.json({ success: true, data: userPasses });
  } catch (error) {
    console.error("Error fetching user daily passes:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if booking exists and belongs to user
    const booking = await db
      .select()
      .from(DailyPass)
      .where(
        and(
          eq(DailyPass.id, id),
          eq(DailyPass.userId, req.user.id),
          eq(DailyPass.paymentStatus, "pending_payment")
        )
      )
      .limit(1);

    if (!booking || booking.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Booking not found or already confirmed",
      });
    }

    // Update booking status
    await db
      .update(DailyPass)
      .set({
        paymentStatus: "paid",
        updatedAt: new Date(),
      })
      .where(eq(DailyPass.id, id));

    res.json({
      success: true,
      message: "Booking confirmed successfully",
    });
  } catch (error) {
    console.error("Error confirming booking:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // First, get the booking details
    const bookingResults = await db
      .select()
      .from(DailyPass)
      .where(eq(DailyPass.id, id))
      .limit(1);

    if (!bookingResults || bookingResults.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    const booking = bookingResults[0];

    // Get related data separately
    const stopResults = await db
      .select()
      .from(RouteStop)
      .where(eq(RouteStop.id, booking.stopId))
      .limit(1);

    const busResults = await db
      .select()
      .from(Bus)
      .where(eq(Bus.routeId, booking.routeId))
      .limit(1);

    const userResults = await db
      .select()
      .from(User)
      .where(eq(User.id, booking.userId))
      .limit(1);

    // Combine the data
    const result = {
      id: booking.id,
      travelDate: booking.travelDate,
      tripTime: booking.tripTime,
      price: booking.price,
      paymentStatus: booking.paymentStatus,
      ticketNo: booking.ticketNo,
      stopName: stopResults[0]?.name,
      busNumber: busResults[0]?.number,
      passengerName: userResults[0]?.name,
      passengerBranch: userResults[0]?.courseName,
      semester: userResults[0]?.semester,
      busNo: busResults[0]?.busNo,
    };

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
