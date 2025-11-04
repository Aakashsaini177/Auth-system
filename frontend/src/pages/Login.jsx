import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError('Email and password are required');
    }

    try {
      const url = `https://auth-backend-77i2.onrender.com/auth/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();
      console.log('Login response:', result);

      const success = result.success || result.status === 'success';
      const token = result.token || result.jwtToken;
      const user = result.user || { username: result.name };

      if (success) {
        handleSuccess(result.message || 'Login successful!');
        localStorage.setItem('token', token);
        localStorage.setItem('loggedInUser', user.username);
        setTimeout(() => navigate('/home'), 1000);
      } else if (result.error) {
        const details =
          result.error?.details?.[0]?.message || result.error || 'Login failed!';
        handleError(details);
      } else {
        handleError(result.message || 'Something went wrong!');
      }
    } catch (err) {
      handleError(err.message || 'Network error!');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white flex items-center justify-center overflow-x-hidden overflow-y-auto px-4">
      <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl w-full max-w-md p-8">
        {/*Title */}
        <h1 className="text-3xl font-extrabold text-center text-white mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Login to access your account
        </p>

        {/*Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
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
              value={loginInfo.email}
              className="bg-gray-800 border border-gray-700 focus:border-purple-500 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            />
          </div>

          {/*Password */}
          <div className="flex flex-col text-sm">
            <label htmlFor="password" className="mb-2 text-gray-300 font-medium">
              Password
            </label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Enter your password..."
              value={loginInfo.password}
              className="bg-gray-800 border border-gray-700 focus:border-purple-500 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            />
          </div>

          {/*Login Button */}
          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105"
          >
            Login
          </button>
        </form>

        {/*Footer Links */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-purple-400 hover:text-purple-300 font-medium transition"
          >
            Signup
          </Link>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Login;
