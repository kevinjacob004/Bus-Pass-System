import { mysqlTable, varchar, timestamp, int } from 'drizzle-orm/mysql-core';
import Route from './Route.js';

const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).notNull().default('student'),
  // Student specific fields
  courseName: varchar('course_name', { length: 50 }),
  semester: int('semester'),
  phoneNo: varchar('phone_no', { length: 20 }),
  dropoffAddress: varchar('dropoff_address', { length: 255 }),
  routeId: varchar('routeId', { length: 36 }).references(() => Route.id, {
    onDelete: 'set null',
    onUpdate: 'cascade'
  }),
  isDayScholar: int('is_day_scholar').default(0),
  status: varchar('status', { length: 20 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export default users;
