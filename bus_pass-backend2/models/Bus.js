import { mysqlTable, int, varchar, timestamp } from 'drizzle-orm/mysql-core';
import Route from './Route.js';

const Bus = mysqlTable('buses', {
  id: varchar('id', { length: 36 }).primaryKey(),
  busNo: int('bus_no').notNull().unique(),
  busRegistrationNo: varchar('bus_registration_no', { length: 20 }).notNull().unique(),
  maxSeatCapacity: int('max_seat_capacity').notNull(),
  routeId: varchar('route_id', { length: 36 }).references(() => Route.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export default Bus;
