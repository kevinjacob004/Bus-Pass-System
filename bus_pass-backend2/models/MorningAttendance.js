// import { mysqlTable, varchar, date, int } from 'drizzle-orm/mysql-core';
const { mysqlTable, varchar,  date, int} = require("drizzle-orm/mysql-core");
import Route from './Route.js';
import Bus from './Bus.js';

const MorningAttendance = mysqlTable('morning_attendance', {
  id: varchar('id', { length: 36 }).primaryKey(),
  date: date('date').notNull(),
  routeId: varchar('route_id', { length: 36 })
    .notNull()
    .references(() => Route.id, 
    //{ onDelete: 'cascade', onUpdate: 'cascade' }
  ),
  busId: varchar('bus_id', { length: 36 })
    .notNull()
    .references(() => Bus.id, 
    //{ onDelete: 'cascade', onUpdate: 'cascade' }
  ),
  count: int('count').notNull(),
});

export default MorningAttendance;