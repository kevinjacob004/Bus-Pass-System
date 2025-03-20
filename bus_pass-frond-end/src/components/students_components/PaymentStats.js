import { useLocation ,Link,useNavigate} from "react-router-dom";
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react"; // Import QRCodeCanvas



const PaymentStats = () => {
  const navigate = useNavigate();
  const qrCodeImagePath = "/qr-code.png"; // Correct path to your image in public
  const location = useLocation();
  const bookingId = location.state?.bookingId; // Retrieve bookingId from state
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("authToken");
  console.log("Booking ID: ", bookingId);
  console.log("User ID: ", userId);
  console.log("Token: ", token);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) return;
      try {
        const response = await fetch(`http://localhost:5000/day-passes/${bookingId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          console.log("Booking details:", data);
          setBookingDetails(data.data); // ✅ Fix: Store only 'data.data'
        } else {
          console.error("Failed to fetch booking details:", data.message);
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };
    fetchBookingDetails();
  }, [bookingId, token]);


  const getTripDetails = () => {
    if (!bookingDetails) return { from: "", to: "" };
    return bookingDetails.tripTime.toLowerCase() === "morning"
      ? { from: bookingDetails.stopName, to: "FISAT" }
      : { from: "FISAT", to: bookingDetails.stopName };
  };

  const { from, to } = getTripDetails();

  // Generate QR Code Data
  const qrData = bookingDetails
  ? `
🚌 Student Bus Ticket 🎟️
----------------------------
📅 Date: ${new Date(bookingDetails.travelDate).toISOString().split('T')[0]}
🕒 Trip Time: ${bookingDetails.tripTime}
🧑 Passenger: ${bookingDetails.passengerName}
🏫 Department: ${bookingDetails.passengerBranch}
📍 From: ${from} ➡ To: ${to}
🚌 Bus No: ${bookingDetails.busNo}
🎫 Ticket ID: ${bookingDetails.ticketNo}
💰 Price: ₹${bookingDetails.price}
----------------------------
🚀 Safe Travels!
`
  : "Loading...";



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
            {/* <Link to="/" className="hover:text-blue-600 text-sm sm:text-base">
              Attendance
            </Link> */}
            {/* <a href="#" className="hover:text-blue-600 text-sm sm:text-base">
              Payments
            </a>
            <a href="#" className="hover:text-blue-600 text-sm sm:text-base">
              Bus Pass
            </a>
            <a href="#" className="hover:text-blue-600 text-sm sm:text-base">
              Routes
            </a>  */}
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
      {/* <main className="flex-1 px-6 sm:px-8 py-8 mt-12">

        <div className="container mx-auto bg-white border border-gray-200 rounded-xl p-8 shadow-sm w-full max-w-lg">
          {bookingDetails ? (
          <><div className="flex flex-col items-center mb-8">
              <div className="bg-gray-100 rounded-full p-3 mb-4">
                <CheckCircleIcon className="h-7 w-7 text-green-500" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Payment Successful!</h2>
              <p className="text-gray-600 text-center">Your bus ticket has been generated</p>
            </div><div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">Bus Number</span>
                  <span className="font-semibold text-gray-700">{bookingDetails.busNo}</span>
                </div>
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">Ticket ID</span>
                  <span className="font-semibold text-gray-700">{bookingDetails.ticketNo}</span>
                </div>
                <div className="flex items-center py-3 space-x-2">
                  <span className="text-gray-600">From</span>
                  <ArrowRightIcon className="h-3 w-3 text-gray-500" />
                  <span className="font-semibold text-gray-700">{from}</span>
                  <span className="ml-auto text-gray-600">To</span>
                  <span className="font-semibold text-gray-700">{to}</span>
                </div>
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold text-gray-700">{bookingDetails.travelDate}</span>
                  <span className="ml-auto text-gray-600">Trip Time</span>
                  <span className="font-semibold text-gray-700">{bookingDetails.tripTime}</span>
                </div>
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">Passenger Name</span>
                  <span className="font-semibold text-gray-700">{bookingDetails.passengerName}</span>
                  <span className="ml-auto text-gray-600">Department</span>
                  <span className="font-semibold text-gray-700">{bookingDetails.passengerBranch}</span>
                </div>
                <div className="flex justify-between py-2 text-sm mt-2">
                  <span className="text-gray-600">Semester</span>
                  <span className="font-semibold text-gray-700">{bookingDetails.semester}</span>
                </div>
                <div className="flex justify-between py-2 text-sm mt-2">
                  <span className="text-gray-600">Ticket Price</span>
                  <span className="font-semibold text-gray-700">{bookingDetails.price}</span>
                </div>
              </div><div className="flex justify-center mt-6 mb-6">
                <img src={qrCodeImagePath} alt="QR Code" className="w-32 h-32" />
              </div><div className="flex items-center justify-center  space-x-4">
                <button className="bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-700 focus:outline-none flex items-center text-sm font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-1.5h10.5a2.25 2.25 0 002.25-2.25V9a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9v3.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  Download Ticket
                </button>
                <button className="bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-700 focus:outline-none flex items-center text-sm font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56-.08m-10.56.08L6.34 18m7.5-10.5l6.88 6.88M7.5 7.5l-1.5 1.5" />
                  </svg>
                  Print
                </button>
              </div></>
          ) : (
            <p className="text-center text-gray-600">Loading booking details...</p>
          )}
        </div>

      </main> */}

      <main className="flex-1 px-6 sm:px-8 py-8 mt-12">
        <div className="container mx-auto bg-white border border-gray-200 rounded-xl p-8 shadow-sm w-full max-w-lg">
          {bookingDetails ? (
            <>
              <div className="flex flex-col items-center mb-8">
                <div className="bg-gray-100 rounded-full p-3 mb-4">
                  <CheckCircleIcon className="h-7 w-7 text-green-500" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">Payment Successful!</h2>
                <p className="text-gray-600 text-center">Your bus ticket has been generated</p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">Bus Number</span>
                  <span className="font-semibold text-gray-700"> {bookingDetails.busNo} </span>
                </div>
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">Ticket ID</span>
                  <span className="font-semibold text-gray-700"> {bookingDetails.ticketNo} </span>
                </div>
                <div className="flex items-center py-3 space-x-2">
                  <span className="text-gray-600">From</span>
                  <ArrowRightIcon className="h-3 w-3 text-gray-500" />
                  <span className="font-semibold text-gray-700"> {from} </span>
                  <span className="ml-auto text-gray-600">To</span>
                  <span className="font-semibold text-gray-700"> {to} </span>
                </div>
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold text-gray-700"> {new Date(bookingDetails.travelDate).toISOString().split('T')[0]} </span>

                  <span className="ml-auto text-gray-600">Trip Time</span>
                  <span className="font-semibold text-gray-700"> {bookingDetails.tripTime} </span>
                </div>

                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">Passenger Name</span>
                  <span className="font-semibold text-gray-700"> {bookingDetails.passengerName} </span>

                  <span className="ml-auto text-gray-600">Department</span>
                  <span className="font-semibold text-gray-700"> {bookingDetails.passengerBranch} </span>
                </div>

                <div className="flex justify-between py-2 text-sm mt-2">
                  <span className="text-gray-600">Semester</span>
                  <span className="font-semibold text-gray-700"> {bookingDetails.semester} </span>
                </div>
                <div className="flex justify-between py-2 text-sm mt-2">
                  <span className="text-gray-600">Ticket Price</span>
                  <span className="font-semibold text-gray-700"> {bookingDetails.price} </span>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex justify-center mt-6 mb-6">
              <QRCodeCanvas value={qrData} size={200} />
              </div>

              <div className="flex items-center justify-center space-x-4">
                <button className="bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-700 focus:outline-none flex items-center text-sm font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-1.5h10.5a2.25 2.25 0 002.25-2.25V9a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9v3.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                  Download Ticket
                </button>
                <button className="bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-700 focus:outline-none flex items-center text-sm font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56-.08m-10.56.08L6.34 18m7.5-10.5l6.88 6.88M7.5 7.5l-1.5 1.5"
                    />
                  </svg>
                  Print
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600">Loading booking details...</p>
          )}
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

export default PaymentStats;