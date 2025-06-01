// src/pages/LoginPage.js
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();
  
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', {
        email,
        password
      });
  
      // Save user info in localStorage after successful login
      localStorage.setItem('user', JSON.stringify({
        token: res.data.token,
        email: res.data.email,
        username: res.data.username
      }));      
  
      // ✅ Clear error and navigate to home
      setError('');
      navigate('/home'); 
    } catch (err) {
      console.error('❌ 로그인 실패:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Login failed');
    }
  }  

  return React.createElement(
    'div',
    { className: 'login-container' },
    
    // App logo
    React.createElement('img', {
      src: '/logo.png',
      alt: 'ChalLedger 로고',
      className: 'login-logo',
    }),

    // Page title
    React.createElement('h1', { className: 'login-title' }, 'Welcome to ChalLedger!'),

    // Login form
    React.createElement(
      'form',
      { className: 'login-form', onSubmit: handleLogin },

      React.createElement('input', {
        type: 'email',
        placeholder: 'Email',
        value: email,
        onChange: (e) => setEmail(e.target.value),
        className: 'login-input',
      }),

      React.createElement('input', {
        type: 'password',
        placeholder: 'Password',
        value: password,
        onChange: (e) => setPassword(e.target.value),
        className: 'login-input',
      }),

      React.createElement('button', { type: 'submit', className: 'login-button' }, 'Login'),

      // Error message
      error &&
        React.createElement(
          'p',
          { style: { color: 'red', fontSize: '14px', marginTop: '10px' } },
          error
        )
    ),

    // Sign-up link
    React.createElement(
      'p',
      { style: { marginTop: '15px' } },
      "Don’t have an account? ",
      React.createElement(
        Link,
        {
          to: '/signup',
          style: { color: 'blue', textDecoration: 'none', fontWeight: 'bold' }
        },
        'Sign up'
      )
    )
  );
}

export default LoginPage;
