// import { eq, and, notInArray, isNull, not, inArray } from 'drizzle-orm';
// import { v4 as uuidv4 } from 'uuid';
const { eq, and, notInArray, isNull, not, inArray }  = require("drizzle-orm");
const { v4: uuidv4 } = require("uuid");
import db from '../config/db.js';
import Route from '../models/Route.js';
import RouteStop from '../models/RouteStop.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

export const addRoute = [
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const { routeName, stops } = req.body;
      const routeId = uuidv4();

      const newRoute = {
        id: routeId,
        routeName
      };

      await db.insert(Route).values(newRoute);

      if (stops && stops.length > 0) {
        const routeStopsData = stops.map((stop, index) => ({
          id: uuidv4(),
          routeId,
          name: stop.name,
          alternateNames: stop.alternateNames,
          fareInRupees: stop.fareInRupees,
          lat: stop.lat,
          lon: stop.lon,
          stopOrder: index + 1
        }));

        await db.insert(RouteStop).values(routeStopsData);
      }

      res.status(201).json({ 
        success: true, 
        data: { ...newRoute, stops }
      });
    } catch (error) {
      console.error('Error adding route:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
];

export const getAllRoutes = [
  protect,
  async (req, res) => {
    try {
      const routesList = await db.select().from(Route);
      
      const routesWithStops = await Promise.all(
        routesList.map(async (route) => {
          const stops = await db
            .select()
            .from(RouteStop)
            .where(eq(RouteStop.routeId, route.id))
            .orderBy(RouteStop.stopOrder);
          
          return { ...route, stops };
        })
      );
      
      res.json({ success: true, data: routesWithStops });
    } catch (error) {
      console.error('Error fetching routes:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
];

export const getRouteById = [
  protect,
  async (req, res) => {
    try {
      const { id } = req.params;
      const route = await db.select().from(Route).where(eq(Route.id, id));
      
      if (!route.length) {
        return res.status(404).json({ success: false, error: 'Route not found' });
      }

      const stops = await db
        .select()
        .from(RouteStop)
        .where(eq(RouteStop.routeId, id))
        .orderBy(RouteStop.stopOrder);
      
      res.json({ success: true, data: { ...route[0], stops } });
    } catch (error) {
      console.error('Error fetching route:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
];

export const updateRoute = [
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { routeName, stops } = req.body;

      await db.update(Route)
        .set({ routeName })
        .where(eq(Route.id, id));

      if (stops && stops.length > 0) {
        // First, get all users associated with this route's stops
        const existingStops = await db
          .select({ id: RouteStop.id })
          .from(RouteStop)
          .where(eq(RouteStop.routeId, id));

        const stopIds = existingStops.map(stop => stop.id);

        // Update users that have these route stops to null FIRST
        await db.update(User)
          .set({ routeStopId: null })
          .where(inArray(User.routeStopId, stopIds));

        // Now it's safe to delete the stops
        await db.delete(RouteStop)
          .where(eq(RouteStop.routeId, id));

        // Create new stops
        const routeStopsData = stops.map((stop, index) => ({
          id: uuidv4(),
          routeId: id,
          name: stop.name,
          alternateNames: stop.alternateNames,
          fareInRupees: stop.fareInRupees,
          lat: stop.lat,
          lon: stop.lon,
          stopOrder: index + 1
        }));
        await db.insert(RouteStop).values(routeStopsData);
      }

      res.json({ success: true, data: { message: 'Route updated successfully' } });
    } catch (error) {
      console.error('Error updating route:', error);
      res.status(500).json({ success: false, error: "Failed to update route. Please try again." });
    }
  }
];

export const deleteRoute = [
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const { id } = req.params;
      
      await db.delete(RouteStop).where(eq(RouteStop.routeId, id));
      await db.delete(Route).where(eq(Route.id, id));
      
      res.json({ success: true, data: { message: 'Route deleted successfully' } });
    } catch (error) {
      console.error('Error deleting route:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
];
