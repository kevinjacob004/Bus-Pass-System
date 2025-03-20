import React from "react";
import { Link , useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
const MyBookings = () => {
  const qrCodeImage = "/qr-code.png";
  const navigate = useNavigate();
  // const location = useLocation();
  // const bookingId = location.state?.bookingId; // Retrieve bookingId from state
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("authToken");
  // console.log("Booking ID: ", bookingId);
  console.log("User ID: ", userId);
  console.log("Token: ", token);
  // Sample Booking History Data
  const [bookingHistory, setBookingHistory] = useState([]);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const response = await fetch("http://localhost:5000/day-passes/my-passes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          console.log("Booking HISTORY details:", data);
          setBookingHistory(data.data); // ✅ Store only relevant data
        } else {
          console.error("Failed to fetch booking details:", data.message);
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };

    fetchBookingHistory();
  }, [token]); // ✅ Include `token` in dependencies

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
            <Link to="/findbus" className="hover:text-blue-600 text-sm sm:text-base">
              Home
            </Link>
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
            {/* <a href="#" className="hover:text-blue-600 text-sm sm:text-base">
              Attendance
            </a>
            <a href="#" className="hover:text-blue-600 text-sm sm:text-base">
              Payments
            </a>
            <a href="#" className="hover:text-blue-600 text-sm sm:text-base">
              Bus Pass
            </a>
            <a href="#" className="hover:text-blue-600 text-sm sm:text-base">
              Routes
            </a> */}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 sm:px-8 py-8">
        <div className="container mx-auto flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <h1 className="text-2xl font-semibold text-gray-800 text-center mb-8">MY BOOKINGS</h1>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm w-full max-w-lg mx-auto">
              <h2 className="text-lg font-semibold text-gray-800 text-center mb-6">Bus Ticket</h2>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                {bookingHistory.length > 0 ? (
                  <>
                    <span className="text-gray-600 font-semibold">Ticket No</span>
                    <span className="text-gray-700">: {bookingHistory[0].ticketNo}</span>
                    <span className="text-gray-600 font-semibold">Travel Date</span>
                    <span className="text-gray-700">: {new Date(bookingHistory[0].travelDate).toLocaleDateString()}</span>
                    <span className="text-gray-600 font-semibold">Trip Time</span>
                    <span className="text-gray-700">: {bookingHistory[0].tripTime}</span>
                    <span className="text-gray-600 font-semibold">Price</span>
                    <span className="text-gray-700">: ${bookingHistory[0].price}</span>
                  </>
                ) : (
                  <span className="text-gray-500">No booking details available</span>
                )}
              </div>
              <div className="flex justify-center mt-6">
                <img src={qrCodeImage} alt="QR Code" className="w-32 h-32" />
              </div>
            </div>
          </div>
          <div className="lg:w-1/3">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking History</h2>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <ul className="space-y-2">
                {bookingHistory.length > 0 ? (
                  bookingHistory.map((booking) => (
                    <li key={booking.id} className="py-2 border-b border-gray-100">
                      <div className="text-sm">
                        <span className="text-gray-700 font-semibold">Ticket No:</span> {booking.ticketNo}
                      </div>
                      <div className="text-sm text-gray-600">
                        Date: {new Date(booking.travelDate).toLocaleDateString()} - {booking.tripTime}
                      </div>
                      <div className="text-sm text-gray-600">Price: ${booking.price}</div>
                      <div className="text-sm text-gray-600">Status: {booking.paymentStatus}</div>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No bookings found.</p>
                )}
              </ul>
            </div>
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

export default MyBookings;
