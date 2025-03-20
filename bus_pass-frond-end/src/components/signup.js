import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUpPage() {

  const navigate = useNavigate();

  // State for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [courseName, setCourseName] = useState("");
  const [semester, setSemester] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");


  const roles = ["student"];
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const courses = ["CS", "IT", "EE", "Mech", "Civil", "ECE"];

  // Handle form submission
  const handleSignUp = async (event) => {
    event.preventDefault();

    const payload = {
      name,
      email,
      password,
      role,
      courseName,
      semester,
      phoneNo,
      dropoffAddress,
    };
    console.log("Form Data:", payload);

    try {
      const response = await fetch("https://bus-pass-system-uysw.onrender.com/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("887878787787", data)
      if (response.ok) {
        alert("Signup successful!");
        navigate("/");
      } else {
        alert(`Signup failed: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred. Please try again later.");
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
      <div className="absolute w-[380px] h-[600px] bg-white shadow-lg rounded-[30px] transform translate-x-[-50%] translate-y-[-50%] left-[50%] top-[50%] p-5">
        {/* Sign-in header */}
        <div className="absolute w-[310px] h-[150px] bg-[#338DED] shadow-lg rounded-[25px] flex flex-col items-center justify-center transform translate-x-[-50%] left-[50%] top-[-9%]">
          <div className="text-white text-3xl font-bold">Join us today</div>
          <div className="text-black text-sm font-normal mt-2 text-center w-[250px] leading-5">
            Enter your email and password <br /> to register
          </div>
        </div>

        {/* Login form */}
        <form className="space-y-4" onSubmit={handleSignUp}>
          <div className="absolute w-[310px] h-[40px] bg-white border border-[#B6AFAF] rounded-[10px] transform translate-x-[-50%] left-[50%] top-[130px] box-border">
            <input
              type="text"
              placeholder="enter your name"
              className="w-full h-full pl-[15px] rounded-[20px] text-[16px] text-[#333] bg-transparent outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email input */}
          <div className="absolute w-[310px] h-[40px] bg-white border border-[#B6AFAF] rounded-[10px] transform translate-x-[-50%] left-[50%] top-[160px] box-border">
            <input
              type="email"
              placeholder="Email"
              className="w-full h-full pl-[15px] rounded-[20px] text-[16px] text-[#333] bg-transparent outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>


          {/* Role input */}
          <div className="absolute w-[310px] h-[40px] bg-white border border-[#B6AFAF] rounded-[10px] transform translate-x-[-50%] left-[50%] top-[210px] box-border">
            <select
              className="w-full h-full pl-[15px] text-[16px] text-[#333] bg-transparent outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="" disabled>Select Role</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>


          {/* Semester input */}
          <div className="absolute w-[310px] h-[40px] bg-white border border-[#B6AFAF] rounded-[10px] transform translate-x-[-50%] left-[50%] top-[260px] box-border">
            <select
              className="w-full h-full pl-[15px] text-[16px] text-[#333] bg-transparent outline-none"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="" disabled>Select Semester</option>
              {semesters.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Course Name input */}
          <div className="absolute w-[310px] h-[40px] bg-white border border-[#B6AFAF] rounded-[10px] transform translate-x-[-50%] left-[50%] top-[310px] box-border">
            <select
              className="w-full h-full pl-[15px] text-[16px] text-[#333] bg-transparent outline-none"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            >
              <option value="" disabled>Select Course</option>
              {courses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          {/* Password input */}
          <div className="absolute w-[310px] h-[40px] bg-white border border-[#B6AFAF] rounded-[10px] transform translate-x-[-50%] left-[50%] top-[360px] box-border">
            <input
              type="password"
              placeholder="Password"
              className="w-full h-full pl-[15px] text-[16px] text-[#333] bg-transparent outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* phonenumber */}
          <div className="absolute w-[310px] h-[40px] bg-white border border-[#B6AFAF] rounded-[10px] transform translate-x-[-50%] left-[50%] top-[410px] box-border">
            <input
              type="number"
              placeholder="phone Number"
              className="w-full h-full pl-[15px] text-[16px] text-[#333] bg-transparent outline-none"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
            />
          </div>
          {/* dropoffAddress */}
          <div className="absolute w-[310px] h-[40px] bg-white border border-[#B6AFAF] rounded-[10px] transform translate-x-[-50%] left-[50%] top-[460px] box-border">
            <input
              type="text"
              placeholder="dropoff Address"
              className="w-full h-full pl-[15px] text-[16px] text-[#333] bg-transparent outline-none"
              value={dropoffAddress}
              onChange={(e) => setDropoffAddress(e.target.value)}
            />
          </div>
          {/* Signup button */}
          <button
            type="submit"
            className="absolute w-[310px] h-[40px] bg-[#338DED] shadow-lg rounded-[10px] flex items-center justify-center transform translate-x-[-50%] left-[50%] top-[85%]"
          >
            <div className="text-white font-bold text-[18px]">Sign Up</div>
          </button>
        </form>

        {/* Sign-up text */}
        <div
          className="absolute w-[413px] h-[26px] transform translate-x-[-50%] left-[50%] top-[95%] text-center font-archivo text-[16px] font-semibold leading-[26px] text-[#C9C0C0]"
        >
          Already have an account?{" "}
          <Link to="/" className="text-[#338DED] cursor-pointer">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;