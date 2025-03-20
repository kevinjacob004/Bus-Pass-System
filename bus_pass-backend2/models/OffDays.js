import { mysqlTable, varchar, date, int, mysqlEnum } from 'drizzle-orm/mysql-core';
import { BRANCHES } from '../utils/constants.js';

const OffDays = mysqlTable('off_days', {
  id: varchar('id', { length: 36 }).primaryKey(),
  semester: int('semester').notNull(),
  branch: mysqlEnum('branch', Object.values(BRANCHES)).notNull(),
  offDate: date('off_date').notNull(),
});

export default OffDays;