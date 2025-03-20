// import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';
import Route from '../models/Route.js';
import RouteStop from '../models/RouteStop.js';
// import { eq, or, like } from 'drizzle-orm';
import Bus from '../models/Bus.js';
import User from '../models/User.js';
import DailyPass from '../models/DailyPass.js';
const { eq, or,like }  = require("drizzle-orm");
const { v4: uuidv4 } = require("uuid");

export const searchRouteStops = async (req, res) => {
    const searchTerm = req.query.searchTerm; 
  
    if (!searchTerm) {
      return res.status(400).json({ success: false, error: 'Search term is required' });
    }
  
    try {
      const results = await db
        .select({
          routeName: Route.routeName,
          routeStopName: RouteStop.name,
          fareInRupees: RouteStop.fareInRupees,
          lat: RouteStop.lat,
          lon: RouteStop.lon,
        })
        .from(RouteStop)
        .innerJoin(Route, eq(RouteStop.routeId, Route.id))
        .where(
          or(
            like(RouteStop.name, `%${searchTerm}%`),
            like(RouteStop.alternateNames, `%${searchTerm}%`)
          )
        )
        .execute();
  
      if (results.length > 0) {
        res.json({ success: true, data: results });
      } else {
        res.status(404).json({ 
          success: true,
          data: [],
          message: "No matching route stops found" 
        });
      }
    } catch (error) {
      console.error("Failed to search route stops:", error);
      res.status(500).json({ success: false, error: "Failed to search route stops" });
    }
  };

/*
export const getBusSeatStats = async (routeId, tripTime="morning") => {
    try {
      const busId = await db.select().from(Bus).where(eq(Bus.routeId, routeId)).execute();
      const bus = busId[0];
      const maxSeatCapacity = bus.maxSeatCapacity;

      let dayScholarUsersCount = await db.select().from(User).where(and(eq(User.routeId, routeId), eq(User.isDayScholar, true))).count();
      const dayPassBookedCount = await db.select().from(DailyPass).where(and(eq(DailyPass.routeId, routeId), eq(DailyPass.isBooked, true), eq(DailyPass.tripTime, tripTime))).count();

      const vacantSeats = maxSeatCapacity - dayScholarUsersCount - dayPassBookedCount;

      return {
        success: true,
        data: {
          dailyScholarUsersCount,
          dayPassBookedCount,
          maxSeatCapacity,
          vacantSeats
        }
      };
    }
    catch (error) {
      console.error("Failed to get bus seat stats", error);
      return { success: false, error: "Failed to get bus seat stats" };
    }
  };
*/

export const deleteRouteStop = async (req, res) => {
  try {
    const { id } = req.params;

    // First, update any users that reference this route stop
    await db.update(User)
      .set({ routeStopId: null })
      .where(eq(User.routeStopId, id));

    // Then delete the route stop
    await db.delete(RouteStop).where(eq(RouteStop.id, id));

    res.json({ success: true, data: { message: 'Route stop deleted successfully' } });
  } catch (error) {
    console.error('Error deleting route stop:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};