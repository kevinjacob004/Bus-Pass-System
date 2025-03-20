import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ViewOffDays = () => {
    const navigate = useNavigate();
    const [offDays, setOffDays] = useState([]);
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

    useEffect(() => {
        const fetchOffDays = async () => {
            try {
                const response = await fetch("http://localhost:5000/off-days", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                const result = await response.json();
                if (response.ok) {
                    setOffDays(result.data);
                } else {
                    console.error("Failed to fetch off days:", result.message);
                }
            } catch (error) {
                console.error("Error fetching off days:", error);
            }
        };
        fetchOffDays();
    }, [token]);

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
                                        onClick={() => handleNavigation("/staff/viewoffdays")}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                                    >
                                        off days
                                    </button>
                                    <button
                                        onClick={() => handleNavigation("/staff/busview")}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                                    >
                                        buses
                                    </button>
                                    <button
                                        onClick={() => handleNavigation("/staff/viewdayscholar")}
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
                                        onClick={() => handleNavigation("/staff/addoffdays")}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                                    >
                                        off days
                                    </button>
                                    {/* <button
                                        onClick={() => handleNavigation("/admin/addstaff")}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                                    >
                                        buses
                                    </button> */}
                                    {/* <button
                                        onClick={() => handleNavigation("/admin/addroute")}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                                    >
                                        Route
                                    </button> */}
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
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Off Days</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {offDays.length > 0 ? (
                            offDays.map((offDay) => (
                                <div key={offDay.id} className="p-4 border rounded-lg shadow-md bg-gray-100">
                                    <p className="text-gray-700 text-lg font-semibold">Semester: <span className="text-blue-600">{offDay.semester}</span></p>
                                    <p className="text-gray-700 text-lg font-semibold">Branch: <span className="text-blue-600">{offDay.branch || "N/A"}</span></p>
                                    <p className="text-gray-700 text-lg font-semibold">Off Date: <span className="text-red-500">{new Date(offDay.offDate).toLocaleDateString()}</span></p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600 col-span-2">No off days found.</p>
                        )}
                    </div>
                </div>
            </main>
            {/* Footer */}
            <footer className="flex justify-between px-6 sm:px-8 py-6 border-t border-gray-200 text-gray-600 flex-col sm:flex-row">
                <div className="text-sm mb-3 sm:mb-0">
                    <h4 className="font-semibold text-gray-700 mb-2">Contact Us</h4>
                    <p>Email: <a href="mailto:support@studentoffdayportal.com" className="text-indigo-600 hover:underline">support@studentoffdayportal.com</a></p>
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

export default ViewOffDays;
