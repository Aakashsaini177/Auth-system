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
      // ✅ Updated URL for deployed backend
      const url = `https://auth-backend-77i2.onrender.com/auth/login`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

        setTimeout(() => {
          navigate('/home');
        }, 1000);
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
    <div className='container'>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor='email'>Email</label>
          <input
            onChange={handleChange}
            type='email'
            name='email'
            placeholder='Enter your email...'
            value={loginInfo.email}
          />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            onChange={handleChange}
            type='password'
            name='password'
            placeholder='Enter your password...'
            value={loginInfo.password}
          />
        </div>
        <button type='submit'>Login</button>
        <span>
          Don't have an account? <Link to='/signup'>Signup</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Login;
