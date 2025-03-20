import { eq, and, count, inArray, or, like } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import db from "../config/db.js";
import Bus from "../models/Bus.js";
import Route from "../models/Route.js";
import User from "../models/User.js";
import DailyPass from "../models/DailyPass.js";
import MorningAttendance from "../models/MorningAttendance.js";
import OffDays from "../models/OffDays.js";
import RouteStop from "../models/RouteStop.js";
import { protect, authorize } from "../middleware/auth.js";
import { calculateVacantSeats } from "../utils/seatCalculations.js";

export const addBus = async (req, res) => {
  try {
    const { busNo, busRegistrationNo, maxSeatCapacity, routeId } = req.body;

    const newBus = {
      id: uuidv4(),
      busNo,
      busRegistrationNo,
      maxSeatCapacity,
      routeId,
    };

    await db.insert(Bus).values(newBus);
    res.status(201).json({ success: true, data: newBus });
  } catch (error) {
    console.error("Error adding bus:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllBuses = async (req, res) => {
  try {
    const busList = await db
      .select({
        id: Bus.id,
        busNo: Bus.busNo,
        busRegistrationNo: Bus.busRegistrationNo,
        maxSeatCapacity: Bus.maxSeatCapacity,
        routeId: Bus.routeId,
        routeName: Route.routeName,
        createdAt: Bus.createdAt,
        updatedAt: Bus.updatedAt,
      })
      .from(Bus)
      .leftJoin(Route, eq(Bus.routeId, Route.id));

    res.json({ success: true, data: busList });
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getBusById = async (req, res) => {
  try {
    const { id } = req.params;
    const bus = await db
      .select({
        id: Bus.id,
        busNo: Bus.busNo,
        busRegistrationNo: Bus.busRegistrationNo,
        maxSeatCapacity: Bus.maxSeatCapacity,
        routeId: Bus.routeId,
        routeName: Route.routeName,
        createdAt: Bus.createdAt,
        updatedAt: Bus.updatedAt,
      })
      .from(Bus)
      .leftJoin(Route, eq(Bus.routeId, Route.id))
      .where(eq(Bus.id, id));

    if (!bus.length) {
      return res.status(404).json({ success: false, error: "Bus not found" });
    }

    res.json({ success: true, data: bus[0] });
  } catch (error) {
    console.error("Error fetching bus:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateBus = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    await db.update(Bus).set(updateData).where(eq(Bus.id, id));

    res.json({ success: true, data: { message: "Bus updated successfully" } });
  } catch (error) {
    console.error("Error updating bus:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteBus = async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(Bus).where(eq(Bus.id, id));
    res.json({ success: true, data: { message: "Bus deleted successfully" } });
  } catch (error) {
    console.error("Error deleting bus:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const calculateOffClassStudents = async (routeId, travelDate) => {
  try {
    // First get the off days for the given date - using date string directly
    const offDayRecords = await db
      .select({
        semester: OffDays.semester,
        branch: OffDays.branch,
      })
      .from(OffDays)
      .where(eq(OffDays.offDate, travelDate));

    console.log("Off day records query:", {
      routeId,
      travelDate,
      offDayRecords,
      sql: db
        .select()
        .from(OffDays)
        .where(eq(OffDays.offDate, travelDate))
        .toSQL(),
    });

    if (!offDayRecords.length) {
      return 0;
    }

    let totalOffStudents = 0;

    for (const record of offDayRecords) {
      const studentsInCombo = await db
        .select({
          count: count(),
        })
        .from(User)
        .where(
          and(
            eq(User.routeId, routeId),
            eq(User.isDayScholar, 1),
            eq(User.semester, record.semester),
            eq(User.courseName, record.branch) // Changed from branch to courseName
          )
        );
      console.log({ studentsInCombo });

      totalOffStudents += studentsInCombo[0]?.count || 0;
    }

    return totalOffStudents;
  } catch (error) {
    console.error("Error calculating off class students:", error);
    return 0;
  }
};

export const getCurrentSeatsStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const today = new Date().toISOString().split("T")[0];
    const { tripTime = "morning", travelDate = today } = req.query;

    const bus = await db
      .select({
        id: Bus.id,
        busNo: Bus.busNo,
        busRegistrationNo: Bus.busRegistrationNo,
        maxSeatCapacity: Bus.maxSeatCapacity,
        routeId: Bus.routeId,
        routeName: Route.routeName,
      })
      .from(Bus)
      .leftJoin(Route, eq(Bus.routeId, Route.id))
      .where(eq(Bus.id, id))
      .limit(1);

    if (!bus || bus.length === 0) {
      return res.status(404).json({ success: false, error: "Bus not found" });
    }

    const { routeId, maxSeatCapacity } = bus[0];

    const seatInfo = await calculateVacantSeats({
      routeId,
      tripTime,
      travelDate,
      maxSeatCapacity,
    });

    res.json({
      success: true,
      data: {
        tripTime,
        travelDate,
        ...seatInfo,
        maxSeatCapacity,
        routeName: bus[0].routeName,
        busNo: bus[0].busNo,
      },
    });
  } catch (error) {
    console.error("Error fetching bus seats status:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const busSearch = async (req, res) => {
  try {
    const { searchTerm } = req.query;

    if (!searchTerm) {
      return res
        .status(400)
        .json({ success: false, error: "Search term is required" });
    }

    const results = await db
      .select({
        routeName: Route.routeName,
        routeId: Route.id,
        stopName: RouteStop.name,
        stopId: RouteStop.id,
        alternateNames: RouteStop.alternateNames,
        busNo: Bus.busNo,
        busRegistrationNo: Bus.busRegistrationNo,
        maxSeatCapacity: Bus.maxSeatCapacity,
        busId: Bus.id,
        fareInRupees: RouteStop.fareInRupees,
      })
      .from(RouteStop)
      .innerJoin(Route, eq(RouteStop.routeId, Route.id))
      .innerJoin(Bus, eq(Route.id, Bus.routeId))
      .where(
        or(
          like(RouteStop.name, `%${searchTerm}%`),
          like(RouteStop.alternateNames, `%${searchTerm}%`)
        )
      );

    if (results.length > 0) {
      res.json({ success: true, data: results });
    } else {
      res.status(404).json({
        success: true,
        data: [],
        message: "No matching routes or stops found",
      });
    }
  } catch (error) {
    console.error("Error searching buses:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
