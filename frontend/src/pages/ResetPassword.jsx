import React from "react";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");

  const { token } = useParams();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    // Implement reset password logic here
    if (!password || !cpassword) {
      return handleError("Both password fields are required");
    }
    if (password !== cpassword) {
      return handleError("Passwords do not match");
    }
    // Add logic to send the new password and token to the backend for resetting the password
    try {
      const url = `${import.meta.env.VITE_API_URL}/auth/reset-password`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const result = await response.json();
      console.log("reset password response:", result);
      if (result?.success) {
        handleSuccess(result.message || "Password reset successful!");
      } else if (result.error) {
        const details =
          result.error?.details?.[0]?.message ||
          result.error ||
          "Login failed!";
        handleError(details);
      } else {
        handleError(result.message || "Something went wrong!");
      }
    } catch (error) {
      handleError("Failed to reset password. Please try again.");
    }
  };
  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white flex items-center justify-center overflow-x-hidden overflow-y-auto px-4">
      <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl w-full max-w-md p-8">
        {/*Title */}
        <h1 className="text-3xl font-extrabold text-center text-white mb-2">
          Reset Password
        </h1>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Enter your new password
        </p>

        {/*Form */}
        <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
          {/* New Password */}
          <div className="flex flex-col text-sm">
            <label
              htmlFor="password"
              className="mb-2 text-gray-300 font-medium"
            >
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              name="password"
              placeholder="Enter your password..."
              value={password}
              className="bg-gray-800 border border-gray-700 focus:border-purple-500 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            />
          </div>
          {/* Confirm Password */}
          <div className="flex flex-col text-sm">
            <label
              htmlFor="cpassword"
              className="mb-2 text-gray-300 font-medium"
            >
              Confirm Password
            </label>
            <input
              onChange={(e) => setCPassword(e.target.value)}
              type="password"
              name="cpassword"
              placeholder="Confirm your password..."
              value={cpassword}
              className="bg-gray-800 border border-gray-700 focus:border-purple-500 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            />
          </div>
          {/*Forgot Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105"
          >
            Reset Password
          </button>
        </form>
        <div className="mt-6 text-center text-gray-400 text-sm">
          <Link
            to="/login"
            className="text-purple-400 hover:text-purple-300 font-medium transition"
          >
            Back to Login
          </Link>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ResetPassword;
