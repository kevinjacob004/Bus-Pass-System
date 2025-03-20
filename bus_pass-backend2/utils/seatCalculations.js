import { eq, and, count } from 'drizzle-orm';
import db from '../config/db.js';
import User from '../models/User.js';
import DailyPass from '../models/DailyPass.js';
import MorningAttendance from '../models/MorningAttendance.js';
import { calculateOffClassStudents } from './offDayCalculations.js';

export const calculateVacantSeats = async ({ routeId, tripTime, travelDate, maxSeatCapacity }) => {
  // Format the date consistently
  const formattedDate = new Date(travelDate).toISOString().split('T')[0];

  // Query day scholars count
  const dayScholars = await db
    .select({
      count: count(User.id)
    })
    .from(User)
    .where(
      and(
        eq(User.routeId, routeId),
        eq(User.isDayScholar, 1)
      )
    );

  const dayScholarUsersCount = dayScholars[0] ? dayScholars[0].count : 0;

  // Query daily pass count
  const dayPasses = await db
    .select({
      count: count(DailyPass.id)
    })
    .from(DailyPass)
    .where(
      and(
        eq(DailyPass.routeId, routeId),
        eq(DailyPass.isBooked, 1),
        eq(DailyPass.tripTime, tripTime),
        eq(DailyPass.travelDate, formattedDate)
      )
    );

  const dayPassBookedCount = dayPasses[0]?.count || 0;
  let vacantSeats = 0;
  let vacantSeatsFromStudentsWithOffClass = null;

  if (tripTime === "morning") {
    vacantSeatsFromStudentsWithOffClass = await calculateOffClassStudents(routeId, formattedDate);
    vacantSeats = maxSeatCapacity - dayScholarUsersCount - dayPassBookedCount + vacantSeatsFromStudentsWithOffClass;
  } else if (tripTime === "evening") {
    const morningAttendanceRecord = await db
      .select({
        count: MorningAttendance.count
      })
      .from(MorningAttendance)
      .where(
        and(
          eq(MorningAttendance.routeId, routeId),
          eq(MorningAttendance.date, formattedDate)
        )
      )
      .limit(1);

    const morningAttendanceCount = morningAttendanceRecord[0]?.count || 0;
    vacantSeats = maxSeatCapacity - morningAttendanceCount - dayPassBookedCount;
  }

  return {
    dayScholarUsersCount,
    dayPassBookedCount,
    vacantSeats,
    vacantSeatsFromStudentsWithOffClass
  };
};