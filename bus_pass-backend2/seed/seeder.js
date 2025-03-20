import 'dotenv/config';
import { readFile } from 'fs/promises';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';
import users from '../models/User.js';
import buses from '../models/Bus.js';
import routes from '../models/Route.js';
import routeStops from '../models/RouteStop.js';
//import bookings from '../models/Booking.js';
import morningAttendance from '../models/MorningAttendance.js';
import dailyPass from '../models/DailyPass.js';

const importData = async () => {
  try {
    // Read data files
    const usersData = JSON.parse(
      await readFile(new URL('./users.json', import.meta.url))
    );
    const busesData = JSON.parse(
      await readFile(new URL('./buses.json', import.meta.url))
    );
    const routesData = JSON.parse(
      await readFile(new URL('./routes.json', import.meta.url))
    );
    const dailyPassesData = JSON.parse(
      await readFile(new URL('./dailyPasses.json', import.meta.url))
    );

    // Prepare routes and stops first to get their IDs
    const routeIds = {};
    const stopIds = {};
    
    const preparedRoutes = routesData.map(route => {
      routeIds[route.routeName] = route.id;
      return {
        id: route.id,
        routeName: route.routeName
      };
    });

    const preparedStops = routesData.flatMap(route => 
      route.stops.map((stop, index) => {
        const stopId = `stop-${route.id.split('-')[1]}-${(index + 1).toString().padStart(2, '0')}`;
        stopIds[`${route.routeName}-${stop.name}`] = stopId;
        return {
          id: stopId,
          routeId: route.id,
          name: stop.name,
          alternateNames: stop.alternateNames,
          fareInRupees: stop.fareInRupees,
          lat: stop.lat,
          lon: stop.lon,
          stopOrder: index + 1
        };
      })
    );

    // Hash passwords for users and keep existing IDs
    const preparedUsers = await Promise.all(
      usersData.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );

    // Prepare buses with route references
    const preparedBuses = busesData.map(bus => ({
      id: uuidv4(),
      ...bus,
      routeId: bus.routeId === '{{CITY_CENTER_ROUTE_ID}}' 
        ? 'route-city-01'
        : 'route-airport-01'
    }));

    // Prepare daily passes (keeping existing IDs and user IDs)
    const preparedDailyPasses = dailyPassesData.map(pass => ({
      ...pass
    }));

    // Clear existing data in correct order (reverse of dependencies)
    //await db.delete(bookings);
    await db.delete(morningAttendance);
    await db.delete(dailyPass);
    await db.delete(buses);
    await db.delete(users);
    await db.delete(routeStops);
    await db.delete(routes);

    // Insert new data in correct order
    await db.insert(routes).values(preparedRoutes);
    await db.insert(routeStops).values(preparedStops);
    await db.insert(users).values(preparedUsers);
    await db.insert(buses).values(preparedBuses);
    await db.insert(dailyPass).values(preparedDailyPasses);

    console.log('Data imported successfully');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Run the import
importData();
