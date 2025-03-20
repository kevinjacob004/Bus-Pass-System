import { eq, and, count } from 'drizzle-orm';
import db from '../config/db.js';
import OffDays from '../models/OffDays.js';
import User from '../models/User.js';

export const calculateOffClassStudents = async (routeId, travelDate) => {
  try {
    const offDayRecords = await db
      .select({
        semester: OffDays.semester,
        branch: OffDays.branch
      })
      .from(OffDays)
      .where(eq(OffDays.offDate, travelDate));

    if (!offDayRecords.length) {
      return 0;
    }

    let totalOffStudents = 0;

    for (const record of offDayRecords) {
      const studentsInCombo = await db
        .select({
          count: count()
        })
        .from(User)
        .where(
          and(
            eq(User.routeId, routeId),
            eq(User.isDayScholar, 1),
            eq(User.semester, record.semester),
            eq(User.courseName, record.branch)
          )
        );
      
      totalOffStudents += studentsInCombo[0]?.count || 0;
    }

    return totalOffStudents;
  } catch (error) {
    console.error('Error calculating off class students:', error);
    return 0;
  }
};