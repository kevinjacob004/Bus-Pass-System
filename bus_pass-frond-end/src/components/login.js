import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Define loading state
  const navigate = useNavigate(); // To navigate upon successful login

  const handleLogin = async (event) => {
    event.preventDefault();
  
    if (!email || !password) {
      alert("Please fill in both fields.");
      return;
    }
  
    setLoading(true); // Start loading
  
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log("Login response:", data);
      setLoading(false); // Stop loading
  
      if (response.ok && data.success) {
        sessionStorage.setItem("authToken", data.token);
        sessionStorage.setItem("userRole", data.role); // Store the role
        sessionStorage.setItem("userId", data.id);
  
        // Navigate based on role
        if (data.role === "student") {
          navigate("/findBus");
        } else if (data.role === "admin") {
          navigate("/admin/viewallbus");
        } else {
          navigate("/staff/busview"); // Default for staff
        }
      } else {
        alert(`Login failed: ${data.message || "Invalid credentials"}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page bg-cover bg-no-repeat min-h-screen flex items-center justify-center text-white"
      style={{
        backgroundImage:
          "url('/fisat.jpeg.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute w-[380px] h-[500px] bg-white shadow-lg rounded-[30px] transform translate-x-[-50%] translate-y-[-50%] left-[50%] top-[50%] p-5">
        {/* Sign-in header */}
        <div className="absolute w-[310px] h-[150px] bg-[#338DED] shadow-lg rounded-[25px] flex items-center justify-center transform translate-x-[-50%] left-[50%] top-[-9%]">
          <div className="text-white text-3xl font-bold">Sign in</div>
        </div>

        {/* Login form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Email input */}
          <div className="absolute w-[310px] h-[40px] bg-white border border-[#B6AFAF] rounded-[10px] transform translate-x-[-50%] left-[50%] top-[200px] box-border">
            <input
              type="email"
              placeholder="Email"
              className="w-full h-full pl-[15px] rounded-[20px] text-[16px] text-[#333] bg-transparent outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password input */}
          <div className="absolute w-[310px] h-[40px] bg-white border border-[#B6AFAF] rounded-[10px] transform translate-x-[-50%] left-[50%] top-[250px] box-border">
            <input
              type="password"
              placeholder="Password"
              className="w-full h-full pl-[15px] rounded-[20px] text-[16px] text-[#333] bg-transparent outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Sign-in button */}
          <button
            type="submit"
            className="absolute w-[310px] h-[40px] bg-[#338DED] shadow-lg rounded-[10px] flex items-center justify-center transform translate-x-[-50%] left-[50%] top-[67%]"
          >
            <div className="text-white font-bold text-[18px]">{loading ? "Logging in..." : "Sign In"}</div>
          </button>
        </form>

        {/* Sign-up text */}
        <div className="absolute w-[413px] h-[26px] transform translate-x-[-50%] left-[50%] top-[88%] text-center font-archivo text-[16px] font-semibold leading-[26px] text-[#C9C0C0]">
          Don’t have an account?{" "}
          <Link
            to="/signup" // Navigate to the SignUpPage
            className="text-[#338DED] cursor-pointer"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
