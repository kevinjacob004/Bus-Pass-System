import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


const ViewSingleBusDetails = () => {
  const navigate = useNavigate(); // ✅ Defined `navigate`
  const { busId } = useParams(); // Get bus ID from URL
  const [bus, setBus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState([]);
  const [studentCount, setStudentCount] = useState(""); // Input field for student count
  const [isSubmitting, setIsSubmitting] = useState(false); // To prevent multiple submissions
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
    const token = sessionStorage.getItem("authToken"); // Retrieve token
    console.log("User token:", token); // Debugging
    const fetchBusDetails = async () => {
      try {
        const response = await fetch(`https://bus-pass-system-uysw.onrender.com/buses/${busId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in header
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bus details");
        }

        const data = await response.json();
        console.log("dataaaaaaaaaaaaaaaaaaaaa", data)
        setBus(data.data || []);
      } catch (error) {
        console.error("Error fetching bus details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusDetails();
  }, [busId]);

  useEffect(() => {
    if (!bus || !bus.routeId) return;

    const token = sessionStorage.getItem("authToken");

    const fetchRouteDetails = async () => {
      try {
        const response = await fetch(`https://bus-pass-system-uysw.onrender.com/routes/${bus.routeId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch route details");
        }

        const routes = await response.json();
        console.log("routessssssssssssssssssssssssss", routes)
        setRoute(routes.data || []); // Store route details
      } catch (error) {
        console.error("Error fetching route details:", error);
      }
    };

    fetchRouteDetails();
  }, [bus]); // Fetch route details only when `bus` is updated

  // const handleProceed = async () => {
  //   if (!studentCount) {
  //     alert("Please enter the number of students present.");
  //     return;
  //   }

  //   if (!bus || !route) {
  //     alert("Bus or route details are missing.");
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   // Define attendanceData
  //   const attendanceData = {
  //     busId: busId,
  //     count: studentCount,
  //     routeId: bus.routeId,
  //     date: new Date().toISOString(),
  //   };
  //   console.log("ppppppppppppppppppppppppppppppppp", attendanceData)
  //   try {
  //     const token = sessionStorage.getItem("authToken");

  //     const response = await fetch("https://bus-pass-system-uysw.onrender.com/morning-attendance", {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(attendanceData),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to submit attendance.");
  //     }

  //     const result = await response.json();
  //     alert("Attendance recorded successfully!");
  //     setStudentCount(""); // Reset input field
  //   } catch (error) {
  //     console.error("Error submitting attendance:", error);
  //     alert("Failed to record attendance. Please try again.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };



  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!bus) return <p className="text-center mt-10">Bus not found</p>;

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 text-2xl sm:text-3xl font-bold">🚍</span>
            <span className="text-lg sm:text-xl font-semibold text-gray-800">Student Bus Portal</span>
          </div>
          <nav className="flex space-x-4 sm:space-x-6 text-gray-600">
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

      <main className="flex-1 px-6 sm:px-8 py-8 mt-12">
        <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-10 shadow-sm">
          <div className="flex items-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mr-4 text-gray-800">
              Bus {bus.busNo}
            </h2>
            <span className="bg-gray-100 text-gray-700 text-sm font-medium rounded-full px-3 py-1">
              Active
            </span>
          </div>



          {/* Route Display */}
          <div className="relative flex items-center justify-between w-full px-4 sm:px-16">
            {/* Horizontal Line */}
            <div className="absolute top-1/2 left-0 right-0 border-t-2 border-gray-500"></div>

            {route?.stops?.map((stop, index) => (
              <div
                key={stop.id}
                className={`relative text-center ${index === 0 ? "ml-0" : index === route.stops.length - 1 ? "mr-0" : "flex-1"
                  }`}
              >
                {/* Changed dot color to green */}
                <div className="w-5 h-5 bg-green-500 rounded-full border-2 border-gray-300 mx-auto"></div>

                <div className={`text-sm font-semibold mt-2 ${index === 0 ? "font-bold" : ""}`}>
                  {stop.name}
                </div>
                {index === 0 && <div className="text-xs text-gray-600">From</div>}
                {index === route.stops.length - 1 && <div className="text-xs text-gray-600">To</div>}
              </div>
            ))}
          </div>




        </div>
        {/* Attendance Input & Submission
        <div className="flex flex-col items-center justify-center mt-8 sm:mt-10 space-y-4">
          <input
            type="number"
            placeholder="Number of Students Present"
            value={studentCount}
            onChange={(e) => setStudentCount(e.target.value)}
            className="p-3 border border-gray-300 rounded w-full sm:w-80 focus:outline-none"
            disabled={isSubmitting}
          />
          <button
            onClick={handleProceed}
            className={`px-14 sm:px-20 py-3 rounded-md text-sm sm:text-base font-medium ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Proceed"}
          </button>
        </div> */}
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

export default ViewSingleBusDetails;
