
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate ,Link} from "react-router-dom";

const BusRoute = () => {
  const navigate = useNavigate(); // ✅ Defined `navigate`
  const location = useLocation();
  const { seatData, busId, price, routeId, stopId } = location.state || {}; // Get values from state

  console.log("Seat Data:", seatData);
  console.log("Bus ID:", busId);
  console.log("Price:", price);
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

    console.log("Route ID:", bus.routeId); // ✅ Log the route ID


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
            <Link to="/findbus" className="hover:text-blue-600 text-sm sm:text-base"></Link>
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
        {/* Attendance Input & Submission */}
        <div className="flex flex-col items-center justify-center mt-8 sm:mt-10 space-y-4">
          <div className="flex justify-center mt-8 sm:mt-10">
            <button onClick={() => navigate(`/checkout`, {
              state: { seatData: seatData, busId: busId, price: price, routeId: routeId, stopId: stopId },
            })} className="bg-indigo-600 text-white px-14 sm:px-80 py-3 rounded-md hover:bg-indigo-700 focus:outline-none text-sm sm:text-base font-medium" >
              Book Now
            </button>
          </div>
        </div>
      </main >

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
    </div >
  );
};

export default BusRoute;
