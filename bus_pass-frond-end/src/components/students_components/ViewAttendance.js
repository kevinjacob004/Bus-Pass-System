import React from "react";

const ViewAttendance = () => {
  // Sample data for attendance
  const attendanceData = [
    { id: 1, studentName: "Akash", department: "CS", attendance: "A", date: "20/01/2025" },
   { id: 2, studentName: "Bala", department: "CS", attendance: "P", date: "21/01/2025" },
      { id: 3, studentName: "Caleb", department: "IT", attendance: "A", date: "22/01/2025" },
    { id: 4, studentName: "David", department: "EE", attendance: "P", date: "23/01/2025" },

   ];

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 text-2xl sm:text-3xl font-bold">
              🚍
            </span>
            <span className="text-lg sm:text-xl font-semibold text-gray-800">
              Student Bus Portal
            </span>
          </div>
          <nav className="flex space-x-4 sm:space-x-6 text-gray-600">
            <a
              href="#"
              className="hover:text-blue-600 text-sm sm:text-base font-medium"
            >
              Home
            </a>
            <a
              href="#"
              className="hover:text-blue-600 text-sm sm:text-base font-medium"
            >
              Mybookings
            </a>
            <a
              href="#"
              className="hover:text-blue-600 text-sm sm:text-base font-medium"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 sm:px-8 py-8 mt-12">
        <div className="container mx-auto">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center mb-8">
            ATTENDANCE DETAILS
          </h1>
           <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-100">
                  <tr className="text-gray-700 text-center text-sm sm:text-base">
                   <th className="p-3">#</th>
                    <th className="p-3">Student Name</th>
                     <th className="p-3">Department</th>
                    <th className="p-3">Attendance</th>
                    <th className="p-3">Date</th>
                       {/* <th className="p-3">Actions</th> */}
                  </tr>
                </thead>
                  <tbody>
                    {attendanceData.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 text-gray-600 text-center text-sm sm:text-base">
                         <td className="p-3">{item.id}</td>
                        <td className="p-3">{item.studentName}</td>
                        <td className="p-3">{item.department}</td>
                        <td className="p-3">{item.attendance}</td>
                       <td className="p-3">{item.date}</td>
                           {/* <td className="p-3">
                           <button className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 focus:outline-none text-xs sm:text-sm font-medium">
                                View
                              </button>
                            </td> */}
                      </tr>
                    ))}
                 </tbody>
              </table>
            </div>
        </div>
      </main>

      <footer className="flex justify-between px-6 sm:px-8 py-6 border-t border-gray-200 text-gray-600 flex-col sm:flex-row">
        <div className="text-sm mb-3 sm:mb-0">
          <h4 className="font-semibold text-gray-700 mb-2">Contact Us</h4>
          <p>
            Email:{" "}
            <a
              href="mailto:support@studentbusportal.com"
              className="text-indigo-600 hover:underline"
            >
              support@studentbusportal.com
            </a>
          </p>
          <p>Phone: +1 234 567 890</p>
        </div>
        <div className="text-sm">
          <h4 className="font-semibold text-gray-700 mb-2">Quick Links</h4>
          <p>
            <a href="/privacy" className="text-indigo-600 hover:underline">
              Privacy Policy
            </a>
          </p>
          <p>
            <a href="/terms" className="text-indigo-600 hover:underline">
              Terms of Service
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ViewAttendance;