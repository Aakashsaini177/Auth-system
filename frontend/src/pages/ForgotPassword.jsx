import React from "react";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    // Implement forgot password logic here
    if (!email) {
      return handleError("Email is required");
    }

    try {
      const url = `${import.meta.env.VITE_API_URL}/auth/request-password-reset`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      console.log("forgot password response:", result);

      const success = result.success === true;

      if (success) {
        handleSuccess(result.message || "Password reset email sent!");
      } else if (result.error) {
        const details =
          result.error?.details?.[0]?.message ||
          result.error ||
          "Password reset failed!";
        handleError(details);
      } else {
        handleError(result.message || "Something went wrong!");
      }
    } catch (err) {
      handleError(err.message || "Network error!");
    }
  };
  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white flex items-center justify-center overflow-x-hidden overflow-y-auto px-4">
      <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl w-full max-w-md p-8">
        {/*Title */}
        <h1 className="text-3xl font-extrabold text-center text-white mb-2">
          Forgot Password
        </h1>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Enter your email to reset your password
        </p>

        {/*Form */}
        <form onSubmit={handleForgotPassword} className="flex flex-col gap-6">
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
              value={email}
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

export default ForgotPassword;
