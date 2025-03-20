// import {
//   mysqlTable,
//   int,
//   date,
//   timestamp,
//   varchar,
//   decimal,
//   boolean,
// } from "drizzle-orm/mysql-core";

const { mysqlTable,int, date, timestamp,varchar,decimal,boolean, } = require("drizzle-orm/mysql-core");
import RouteStop from "./RouteStop.js";
import User from "./User.js";
import Route from "./Route.js";
//import { boolean } from 'drizzle-orm/pg-core';

const DayPass = mysqlTable("day_pass", {
  id: varchar("id", { length: 36 }).primaryKey(),
  ticketNo: int("ticket_no").default(0).notNull(),
  travelDate: date("travel_date").notNull(),
  issuedDatetime: timestamp("issued_datetime").defaultNow(),
  tripTime: varchar("trip_time", { length: 10 }).notNull(), // morning - evening
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 20 })
    .notNull()
    .default("pending_payment"),
  stopId: varchar("stop_id", { length: 36 })
    .notNull()
    .references(() => RouteStop.id),
  routeId: varchar("route_id", { length: 36 })
    .notNull()
    .references(() => Route.id),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => User.id),
  isBooked: boolean("is_booked").default(false),
});

export default DayPass;
