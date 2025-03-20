import { mysqlTable, varchar, timestamp, decimal, int } from 'drizzle-orm/mysql-core';
import Route from './Route.js';

const RouteStop = mysqlTable('route_stops', {
  id: varchar('id', { length: 36 }).primaryKey(),
  routeId: varchar('route_id', { length: 36 }).notNull().references(() => Route.id),
  name: varchar('name', { length: 100 }).notNull(),
  alternateNames: varchar('alternate_names', { length: 200 }),
  fareInRupees: decimal('fare_in_rupees', { precision: 10, scale: 2 }).notNull(),
  lat: decimal('latitude', { precision: 10, scale: 7 }).notNull(),
  lon: decimal('longitude', { precision: 10, scale: 7 }).notNull(),
  stopOrder: int('stop_order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export default RouteStop;
