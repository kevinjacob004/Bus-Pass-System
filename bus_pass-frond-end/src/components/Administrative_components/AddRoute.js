import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddRoute = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("authToken");

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
    // Form State
    const [routeName, setRouteName] = useState("");
    const [stops, setStops] = useState([
        { name: "", alternateNames: "", fareInRupees: "", lat: "", lon: "" }
    ]);

    // Handle Input Change
    const handleStopChange = (index, field, value) => {
        const updatedStops = [...stops];
        updatedStops[index][field] = value;
        setStops(updatedStops);
    };

    // Add a New Stop
    const addStop = () => {
        setStops([...stops, { name: "", alternateNames: "", fareInRupees: "", lat: "", lon: "" }]);
    };

    // Remove a Stop
    const removeStop = (index) => {
        if (stops.length > 1) {
            setStops(stops.filter((_, i) => i !== index));
        }
    };

    // Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        const routeData = { routeName, stops };

        try {
            const response = await fetch("http://localhost:5000/routes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(routeData),
            });

            const result = await response.json();
            if (response.ok) {
                alert("Route added successfully!");
                navigate("/admin/viewallbus"); // Redirect after success
            } else {
                alert("Failed to add route: " + result.message);
            }
        } catch (error) {
            console.error("Error adding route:", error);
        }
    };

    return (
        <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
            {/* Header */}
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
            <main className="flex-grow flex items-center justify-center p-6">
                <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg border border-gray-200">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Create New Route</h2>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Route Name */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Route Name</label>
                            <input
                                type="text"
                                value={routeName}
                                onChange={(e) => setRouteName(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
                                placeholder="Enter route name"
                                required
                            />
                        </div>

                        {/* Stops Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Stops</h3>
                            {stops.map((stop, index) => (
                                <div key={index} className="mb-4 p-4 border rounded-lg shadow-sm bg-gray-50">
                                    <label className="block text-gray-700 font-medium">Stop Name</label>
                                    <input
                                        type="text"
                                        value={stop.name}
                                        onChange={(e) => handleStopChange(index, "name", e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg shadow-sm"
                                        placeholder="Stop Name"
                                        required
                                    />

                                    <label className="block text-gray-700 font-medium mt-2">Alternate Names</label>
                                    <input
                                        type="text"
                                        value={stop.alternateNames}
                                        onChange={(e) => handleStopChange(index, "alternateNames", e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg shadow-sm"
                                        placeholder="Alternate Names"
                                    />

                                    <label className="block text-gray-700 font-medium mt-2">Fare (₹)</label>
                                    <input
                                        type="number"
                                        value={stop.fareInRupees}
                                        onChange={(e) => handleStopChange(index, "fareInRupees", e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg shadow-sm"
                                        placeholder="Fare"
                                        required
                                    />

                                    <label className="block text-gray-700 font-medium mt-2">Latitude</label>
                                    <input
                                        type="number"
                                        value={stop.lat}
                                        onChange={(e) => handleStopChange(index, "lat", e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg shadow-sm"
                                        placeholder="Latitude"
                                        // required
                                    />

                                    <label className="block text-gray-700 font-medium mt-2">Longitude</label>
                                    <input
                                        type="number"
                                        value={stop.lon}
                                        onChange={(e) => handleStopChange(index, "lon", e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg shadow-sm"
                                        placeholder="Longitude"
                                        // required
                                    />

                                    {stops.length > 1 && (
                                        <button
                                            type="button"
                                            className="mt-3 text-red-500 hover:underline"
                                            onClick={() => removeStop(index)}
                                        >
                                            Remove Stop
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addStop}
                                className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
                            >
                                + Add Another Stop
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md text-lg font-semibold">
                            Add Route
                        </button>
                    </form>
                </div>
            </main>

            {/* Footer */}
            <footer className="flex justify-between px-6 sm:px-8 py-6 border-t border-gray-200 text-gray-600 flex-col sm:flex-row">
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

export default AddRoute;
