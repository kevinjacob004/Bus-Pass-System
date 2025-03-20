import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 text-center max-w-md">
        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto">
          <svg
            className="w-10 h-10 text-red-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          Payment Failed!
        </h2>
        <p className="text-gray-600 mt-2">
          Unfortunately, your payment could not be processed.
        </p>
        <button
          onClick={() => navigate("/checkout")}
          className="mt-6 px-6 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default PaymentFailed;
