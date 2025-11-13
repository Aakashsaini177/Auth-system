import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const copySignupInfo = { ...signupInfo };
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { username, email, password } = signupInfo;

    if (!username || !email || !password) {
      return handleError("Name, email and password are required");
    }

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (password.length < 4) {
      return handleError("Password must be at least 4 characters long");
    }
    if (!specialCharRegex.test(password)) {
      return handleError(
        "Password must include at least one special character"
      );
    }

    try {
      const url = `${import.meta.env.VITE_API_URL}/auth/signup`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });

      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (error) {
        const details = error?.details?.[0]?.message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
      console.log(result);
    } catch (err) {
      handleError(err.message || "Network error");
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white flex items-center justify-center overflow-x-hidden overflow-y-auto px-4">
      <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl w-full max-w-md p-8">
        {/*   Title */}
        <h1 className="text-3xl font-extrabold text-center text-white mb-2">
          Create an Account
        </h1>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Join us today and start your journey!
        </p>

        {/*  Form */}
        <form onSubmit={handleSignup} className="flex flex-col gap-6">
          {/* Username */}
          <div className="flex flex-col text-sm">
            <label htmlFor="name" className="mb-2 text-gray-300 font-medium">
              Name
            </label>
            <input
              onChange={handleChange}
              type="text"
              name="username"
              autoFocus
              placeholder="Enter your name..."
              value={signupInfo.username}
              className="bg-gray-800 border border-gray-700 focus:border-purple-500 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col text-sm">
            <label htmlFor="email" className="mb-2 text-gray-300 font-medium">
              Email
            </label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={signupInfo.email}
              className="bg-gray-800 border border-gray-700 focus:border-purple-500 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col text-sm">
            <label
              htmlFor="password"
              className="mb-2 text-gray-300 font-medium"
            >
              Password
            </label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Enter your password..."
              value={signupInfo.password}
              className="bg-gray-800 border border-gray-700 focus:border-purple-500 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105"
          >
            Signup
          </button>
        </form>

        {/*  Footer Links */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-400 hover:text-purple-300 font-medium transition"
          >
            Login
          </Link>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Signup;
