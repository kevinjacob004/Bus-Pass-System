
import { useLocation, useNavigate ,Link} from "react-router-dom";
import { FaBus, FaRoute, FaClock, FaCalendarAlt, FaUsers, FaChair } from "react-icons/fa";

const ViewBus = () => {
  const location = useLocation();
  const { seatData, busId, price, routeId, stopId } = location.state || {}; // Retrieve passed data
  console.log("busId", busId, "price", price, "routeId", routeId, "stopId", stopId);
  const navigate = useNavigate();

  // const handleSeeRoute = () => {
  //   navigate("/viewbusroute", {
  //     state: { busId:busId },
  //   });
  // };

  if (!seatData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold">No bus data available. Please try again.</p>
      </div>
    );
  }



  return (
    <div className="font-sans flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 text-2xl sm:text-3xl font-bold">🚍</span>
            <span className="text-lg sm:text-xl font-semibold text-gray-800">Student Bus Portal</span>
          </div>
          <nav className="flex space-x-4 sm:space-x-6 text-gray-600">
            <Link to="/findbus" className="hover:text-blue-600 text-sm sm:text-base">
              Home
            </Link>
            <Link to="/mybookings" className="hover:text-blue-600 text-sm sm:text-base">My Bookings</Link>
            {/* <a href="#" className="hover:text-blue-600 text-sm sm:text-base">Payments</a>
            <a href="#" className="hover:text-blue-600 text-sm sm:text-base">Bus Pass</a>
            <a href="#" className="hover:text-blue-600 text-sm sm:text-base">Routes</a> */}
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

      <main className="flex-1 px-6 py-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Bus Details</h1>

        <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <FaBus className="text-indigo-600 text-2xl" />
            <h3 className="text-xl font-semibold text-gray-700">Bus Number: {seatData.busNo}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <FaRoute className="text-green-600" />
              <p className="text-gray-700"><strong>Route:</strong> {seatData.routeName}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaClock className="text-yellow-600" />
              <p className="text-gray-700"><strong>Trip Time:</strong> {seatData.tripTime}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-blue-600" />
              <p className="text-gray-700"><strong>Travel Date:</strong> {seatData.travelDate}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaChair className="text-purple-600" />
              <p className="text-gray-700"><strong>Vacant Seats:</strong> {seatData.vacantSeats} / {seatData.maxSeatCapacity}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaUsers className="text-red-600" />
              <p className="text-gray-700"><strong>Day Pass Booked:</strong> {seatData.dayPassBookedCount}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaUsers className="text-indigo-600" />
              <p className="text-gray-700"><strong>Day Scholar Users:</strong> {seatData.dayScholarUsersCount}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaUsers className="text-gray-600" />
              <p className="text-gray-700"><strong>Seats from Off-Class Students:</strong> {seatData.vacantSeatsFromStudentsWithOffClass}</p>
            </div>
          </div>
          <br></br>
          <button onClick={() => navigate(`/viewbusroute`, {
            state: { seatData: seatData, busId: busId, price: price, routeId: routeId, stopId: stopId },
          })} className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 focus:outline-none text-xs sm:text-sm font-medium">See Route</button>
        </div>
      </main>

      <footer className="flex justify-between px-8 py-6 border-t border-gray-200 text-gray-600 flex-col sm:flex-row">
        <div className="text-sm mb-3 sm:mb-0">
          <h4 className="font-semibold text-gray-700 mb-2">Contact Us</h4>
          <p>Email: <a href="mailto:support@studentbusportal.com" className="text-indigo-600 hover:underline">support@studentbusportal.com</a></p>
          <p>Phone: +1 234 567 890</p>
        </div>
        <div className="text-sm">
          <h4 className="font-semibold text-gray-700 mb-2">Quick Links</h4>
          <p><a href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a></p>
          <p><a href="/terms" className="text-indigo-600 hover:underline">Terms of Service</a></p>
        </div>
      </footer>
    </div>
  );
};

export default ViewBus;
