import { mysqlTable, varchar, timestamp } from 'drizzle-orm/mysql-core';

const Route = mysqlTable('routes', {
  id: varchar('id', { length: 36 }).primaryKey(),
  routeName: varchar('route_name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export default Route;
