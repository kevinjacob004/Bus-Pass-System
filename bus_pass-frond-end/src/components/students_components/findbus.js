import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const FindBus = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [busId, setBusId] = useState(null);
  const [price, setPrice] = useState(null);
  const [routeId, setRouteId] = useState([]);
  const [stopId, setStopId] = useState([]);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [tripTime, setTripTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour < 15) {
      setFrom("FISAT");
      setTripTime("morning");
    } else {
      setTo("FISAT");
      setTripTime("evening");
    }

    const today = now.toISOString().split("T")[0];
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split("T")[0];

    setDate(currentHour < 15 ? today : tomorrowDate);
  }, []);

  const fetchStops = async (query, setSuggestions) => {
    if (query.length < 2) return;
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await fetch(`https://bus-pass-system-uysw.onrender.com/buses/search?searchTerm=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        setSuggestions([...new Set(data.data.map((item) => item.stopName))]);
        if (data.data.length > 0) {
          setBusId(data.data[0].busId);
          setPrice(data.data[0].fareInRupees);
          setRouteId(data.data[0].routeId);
          setStopId(data.data[0].stopId);
        }
      }
    } catch (error) {
      console.error("Error fetching stops:", error);
    }
  };

  const handleFindNow = async () => {
    if (!busId) {
      alert("Please select a bus first.");
      return;
    }

    try {
      const token = sessionStorage.getItem("authToken");
      const response = await fetch(
        `https://bus-pass-system-uysw.onrender.com/buses/${busId}/seats?tripTime=${tripTime}&travelDate=${date}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      console.log("Seat Status Response:", data);

      if (data.success) {
        // Navigate or handle the seat status data as required
        navigate("/viewBus", { state: { seatData: data.data, busId: busId, price: price,routeId:routeId,stopId:stopId } });
      } else {
        alert("Failed to fetch seat status.");
      }
    } catch (error) {
      console.error("Error fetching seat status:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 text-2xl sm:text-3xl font-bold">🚍</span>
            <span className="text-lg sm:text-xl font-semibold text-gray-800">Student Bus Portal</span>
          </div>
          <nav className="flex space-x-4 sm:space-x-6 text-gray-600">
            <Link to="/mybookings" className="hover:text-blue-600 text-sm sm:text-base">My Bookings</Link>
            {/* <a href="#" className="hover:text-blue-600 text-sm sm:text-base">Attendance</a>
            <a href="#" className="hover:text-blue-600 text-sm sm:text-base">Payments</a>
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

      {/* Main Content */}
      <main className="flex-grow flex justify-center items-center py-16 px-4">
        <div className="w-full max-w-md sm:max-w-2xl bg-blue-50 rounded-lg shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">Find Bus Route</h1>
          <form className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600">From</label>
                <input
                  type="text"
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value);
                    fetchStops(e.target.value, setFromSuggestions);
                  }}
                  className="mt-1 w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Select starting point"
                />
                {fromSuggestions.length > 0 && (
                  <ul className="border bg-white rounded-md mt-1 shadow-md">
                    {fromSuggestions.map((stop, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                          setFrom(stop);
                          setFromSuggestions([]);
                        }}
                      >
                        {stop}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">To</label>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => {
                    setTo(e.target.value);
                    fetchStops(e.target.value, setToSuggestions);
                  }}
                  className="mt-1 w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Select destination"
                />
                {toSuggestions.length > 0 && (
                  <ul className="border bg-white rounded-md mt-1 shadow-md">
                    {toSuggestions.map((stop, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                          setTo(stop);
                          setToSuggestions([]);
                        }}
                      >
                        {stop}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Date</label>
              <input
                type="date"
                value={date}
                readOnly
                className="mt-1 w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={handleFindNow}
              className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-md font-medium text-sm sm:text-base hover:bg-blue-700 transition"
            >
              Find Now
            </button>
          </form>
        </div>
      </main>

      {/* footer starts*/}
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
      {/* footer ends */}
    </div>
  );
};

export default FindBus;
