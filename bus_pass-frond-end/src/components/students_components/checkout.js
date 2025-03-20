import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
const Checkout = () => {
  const navigate = useNavigate();
  const [paymentOption, setPaymentOption] = useState("");
  const location = useLocation();
  const { seatData, busId, price, routeId, stopId } = location.state || {}; // Get values from state
  const [userDetails, setUserDetails] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  console.log(" checkout Seat Data:", seatData);
  console.log("checkout Bus ID:", busId);
  console.log("checkout Price:", price);
  console.log("checkout RouteId:", routeId);
  console.log("checkout StopId:", stopId);

  const handlePaymentChange = (event) => {
    setPaymentOption(event.target.value);
  };
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("authToken");
  console.log("id514444444444444444444444444444444", userId);


  useEffect(() => {
    if (userId) {
      fetch(`https://bus-pass-system-uysw.onrender.com/users/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setUserDetails(data.data);
            console.log("User details:", data.data);
          } else {
            console.error("Failed to fetch user details");
          }
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [userId]);

  // const taxPrice = 1; // Fixed tax price
  const totalPrice = price;

  //confirm Booking
  const confirmBooking = async (bookingId) => {
    try {
      const confirmResponse = await fetch(
        `https://bus-pass-system-uysw.onrender.com/day-passes/confirm/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const confirmData = await confirmResponse.json();
      if (confirmData.success) {
        console.log("Booking confirmed!", confirmData);
        navigate("/paymentstatus", { state: { bookingId } });
      } else {
        alert("Booking confirmation failed.");
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("An error occurred while confirming the booking.");
    }
  };


  //pay now functionalities

  // const handlePayment = async () => {
  //   if (!seatData || !price) {
  //     alert("Invalid booking details");
  //     return;
  //   }

  //   const bookingData = {
  //     travelDate: seatData.travelDate,
  //     tripTime: seatData.tripTime,
  //     stopId: stopId,
  //     routeId: routeId,
  //     price: price, // Use price from state
  //   };

  //   console.log("Booking data being sent:", bookingData);

  //   try {
  //     const response = await fetch("https://bus-pass-system-uysw.onrender.com/day-passes/booking", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(bookingData),
  //     });

  //     const data = await response.json();
  //     if (data.success) {
  //       // alert("Booking successful!");
  //       // Extract booking ID
  //       const bookingId = data.data.id;

  //       // Call the confirmation API
  //       confirmBooking(bookingId);
  //       navigate("/paymentstatus");
  //       console.log("Booking response:", data);
  //     } else {
  //       navigate("/paymentfailed");
  //       alert("Booking failed. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error booking ticket:", error);
  //     alert("An error occurred. Please try again.");
  //   }
  // };

  const handlePayment = async () => {
    // Check vacant seats before proceeding
    if (!seatData || seatData.vacantSeats === 0) {
      alert("No vacant seats available. Please choose another bus.");
      return;
    }

    // Check if payment option is selected
    if (!paymentOption) {
      navigate("/paymentfailed");
      alert("Please select a payment option.");
      return;
    }

    // Validate card details
    if (paymentOption === "card") {
      const cardNumber = document.getElementById("cardNumber")?.value;
      const expiry = document.getElementById("expiry")?.value;
      const cvv = document.getElementById("cvv")?.value;

      if (!cardNumber || !expiry || !cvv) {
        // alert("Please enter all card details.");
        navigate("/paymentfailed");
        return;
      }
    }

    // Validate UPI ID
    if (paymentOption === "upi") {
      const upiId = document.getElementById("upiId")?.value;
      if (!upiId) {
        // alert("Please enter your UPI ID.");
        navigate("/paymentfailed");
        return;
      }
    }

    if (!seatData || !price) {
      alert("Invalid booking details");
      return;
    }

    const bookingData = {
      travelDate: seatData.travelDate,
      tripTime: seatData.tripTime,
      stopId: stopId,
      routeId: routeId,
      price: price,
    };

    console.log("Booking data being sent:", bookingData);

    try {
      const response = await fetch("https://bus-pass-system-uysw.onrender.com/day-passes/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
      if (data.success) {
        const bookingId = data.data.id;
        // Show confirmation menu before calling confirmBooking
        console.log("Booking ID received:", bookingId);
        setBookingId(bookingId); // ✅ Ensure bookingId is set first
        setTimeout(() => {
          setShowModal(true); // ✅ Open modal after setting bookingId
        }, 100); // Small delay to ensure state update
        // navigate("/paymentstatus");
        console.log("Booking response:", data);
      } else {
        navigate("/paymentfailed");
        alert("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error booking ticket:", error);
      alert("An error occurred. Please try again.");
      navigate("/paymentfailed");
    }
  };


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
        <div className="container mx-auto flex flex-col lg:flex-row gap-8">
          {/* Booking Details Section */}
          <div className="lg:w-2/3 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Complete Your Booking
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-3 border border-gray-300 rounded w-full bg-gray-100">
                  <p className="text-gray-700">{userDetails?.name || "N/A"}</p>
                </div>
                <div className="p-3 border border-gray-300 rounded w-full bg-gray-100">
                  <p className="text-gray-700">{userDetails?.email || "N/A"}</p>
                </div>
                <div className="p-3 border border-gray-300 rounded w-full bg-gray-100">
                  <p className="text-gray-700">{userDetails?.phoneNo || "N/A"}</p>
                </div>
                <div className="p-3 border border-gray-300 rounded w-full bg-gray-100">
                  <p className="text-gray-700">{userDetails?.dropoffAddress || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="space-y-3 mt-8">
              <h3 className="text-xl font-semibold text-gray-800">
                Payment Options
              </h3>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    onChange={handlePaymentChange}
                    checked={paymentOption === "card"}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-1"
                  />
                  <label className="text-gray-700">Credit/Debit card</label>
                </div>
                {paymentOption === "card" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input id="cardNumber" type="text" placeholder="Card Number" className="p-3 border border-gray-300 rounded w-full focus:outline-none" />
                    <input id="expiry" type="text" placeholder="Valid Thru (MM/YY)" className="p-3 border border-gray-300 rounded w-full focus:outline-none" />
                    <input id="cvv" type="text" placeholder="CVV" className="p-3 border border-gray-300 rounded w-full focus:outline-none" />
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    onChange={handlePaymentChange}
                    checked={paymentOption === "upi"}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-1"
                  />
                  <label className="text-gray-700">Upi ID</label>
                </div>
                {paymentOption === "upi" && (
                  <input id="upiId" type="text" placeholder="Enter UPI ID" className="p-3 border border-gray-300 rounded w-full focus:outline-none" />
                )}
              </div>
            </div>
            <button onClick={handlePayment} className="bg-indigo-600 text-white px-14 sm:px-20 py-3 rounded-md hover:bg-indigo-700 focus:outline-none w-full mt-6 text-sm sm:text-base font-medium">
              Pay Now
            </button>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-1/3">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-fit">
              <h3 className="text-xl font-semibold text-gray-800 mb-5">Order Summary</h3>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">Ticket Price</span>
                <span className="text-gray-700">₹{price}</span>
              </div>
              {/* <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">Tax</span>
                <span className="text-gray-700">₹{taxPrice}</span>
              </div> */}
              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center font-semibold">
                <span className="text-gray-800">Total</span>
                <span className="text-gray-800">₹{totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-xl font-bold mb-4">Confirm Your Booking</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to confirm your booking?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  confirmBooking(bookingId);
                  setShowModal(false);
                }}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

export default Checkout;
