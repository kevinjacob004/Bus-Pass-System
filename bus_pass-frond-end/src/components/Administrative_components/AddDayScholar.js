import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddDayScholar = () => {
  const navigate = useNavigate(); // ✅ Defined `navigate`

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    // role: 'staff',
    phoneNo: "",
    role: 'student',
    isDayScholar: true,
    dropoffAddress:"",
    
  });
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
  


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://bus-pass-system-uysw.onrender.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      console.log("Response:", result);
      if (response.ok) {
        alert("Staff creation successful!");
        navigate("/admin/viewdayscholar");
      } else {
        alert("Staff creation failed: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
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
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Create New DayScholar</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" placeholder="Enter name" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" placeholder="Enter email" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" placeholder="Enter password" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Phone No</label>
              <input type="tel" name="phoneNo" value={formData.phoneNo} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" placeholder="Enter phone number" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">DropOff Address</label>
              <input type="text" name="dropoffAddress" value={formData.dropoffAddress} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" placeholder="Enter phone number" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md text-lg font-semibold">Add</button>
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

export default AddDayScholar;
