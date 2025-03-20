import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const ViewDayScolar = () => {
  const [dayScholarData, setdayScholarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // ✅ Defined `navigate`
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleDropdown1 = () => {
    setIsDropdownOpen1(!isDropdownOpen1);
  };
  const handleNavigation = (path) => {
    navigate(path);
    setIsDropdownOpen(false); // Close dropdown after navigation
  };

  useEffect(() => {
    const fetchDayscholers = async () => {
      const token = sessionStorage.getItem("authToken");
      const role = sessionStorage.getItem("userRole")
      console.log("User token:role", token, role);

      try {
        const response = await fetch("http://localhost:5000/users?role=student", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bus details");
        }

        const data = await response.json();
        console.log("DayScholar Data:", data);
        setdayScholarData(data.data.users || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDayscholers();
  }, []);

  const handleDelete = async (dayScholarid) => {
    const token = sessionStorage.getItem("authToken");

    if (!window.confirm("Are you sure you want to delete this Student?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/${dayScholarid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete DayScholar");
      }

      // Remove deleted staff from the state
      setdayScholarData((prevDayScholarData) =>
        prevDayScholarData.filter((dayScholar) => dayScholar.id !== dayScholarid)
      );

      alert("DayScholar deleted successfully!");
    } catch (error) {
      alert("Error deleting staff: " + error.message);
    }
  };


  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto flex justify-between items-center py-4 px-16">
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 text-2xl sm:text-3xl font-bold">🚍</span>
            <span className="text-lg sm:text-xl font-semibold text-gray-800">Student Bus Portal</span>
          </div>
          <nav className="flex space-x-4 sm:space-x-12 text-gray-600">
            {/* View Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="hover:text-blue-600 text-sm sm:text-base font-medium focus:outline-none"
            >
              View 
            </button>
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-40 bg-white shadow-md rounded-lg z-10">
                <button
                  onClick={() => handleNavigation("/admin/viewallbus")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                >
                  Bus
                </button>
                <button
                  onClick={() => handleNavigation("/admin/viewallstaff")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                >
                  Staff
                </button>
                <button
                    onClick={() => handleNavigation("/admin/viewdayscholar")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    Day Scholar
                  </button>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={toggleDropdown1}
              className="hover:text-blue-600 text-sm sm:text-base font-medium focus:outline-none"
            >
              Add 
            </button>
            {isDropdownOpen1 && (
              <div className="absolute left-0 mt-2 w-40 bg-white shadow-md rounded-lg z-10">
                <button
                  onClick={() => handleNavigation("/admin/addBus")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                >
                  Bus
                </button>
                <button
                  onClick={() => handleNavigation("/admin/addstaff")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                >
                  Staff
                </button>
                <button
                    onClick={() => handleNavigation("/admin/addroute")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    Route
                  </button>
                  <button
                    onClick={() => handleNavigation("/admin/adddayscholar")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    Day Scholar
                  </button>
              </div>
            )}
          </div>
          {/* Logout Button */}
          <button
              onClick={() => {
                sessionStorage.removeItem("authToken");
                sessionStorage.removeItem("userRole");
                navigate("/");  // Redirect to login page
              }}
              className="text-red-600 hover:text-red-700 font-medium text-sm sm:text-base"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 sm:px-8 py-8 mt-12">
        <div className="container mx-auto">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center mb-8">
            {loading && <p className="text-center text-gray-600">Loading Staff Details...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
          </h1>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr className="text-gray-700 text-center text-sm sm:text-base">
                  <th className="p-3">Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Email ID</th>
                  <th className="p-3">Course Name</th>
                  <th className="p-3">DropOffAddress</th>
                  <th className="p-3">Semeseter</th>
                  <th className="p-3">Phone Number</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dayScholarData.length > 0 ? (
                  dayScholarData.map((dayScholar) => (
                    <tr key={dayScholar.id} className="border-b border-gray-100 text-gray-600 text-center text-sm sm:text-base">
                      <td className="p-3">{dayScholar.name}</td>
                      <td className="p-3">{dayScholar.role}</td>
                      <td className="p-3">{dayScholar.email}</td>
                      <td className="p-3">{dayScholar.courseName}</td>
                      <td className="p-3">{dayScholar.dropoffAddress}</td>
                      <td className="p-3">{dayScholar.semester}</td>
                      <td className="p-3">{dayScholar.phoneNo}</td>
                      {/* <td className="p-3">{bus.maxSeatCapacity}</td> */}
                      {/* <td>Active</td> */}
                      <td>
                        <button
                          onClick={() => handleDelete(dayScholar.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 focus:outline-none text-xs sm:text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="text-center p-3">No data available</td></tr>
                )}
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

export default ViewDayScolar;