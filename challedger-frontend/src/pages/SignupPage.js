// src/pages/SignupPage.js
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSignup(event) {
    event.preventDefault();
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:4000/api/auth/signup', {
        email,
        password,
      });
  
      console.log('✅ 회원가입 성공:', response.data);
  
      // 회원가입 성공 시 로그인 페이지로 이동
      navigate('/');
    } catch (err) {
      console.error('❌ 회원가입 실패:', err.response?.data || err.message);
      const message = err.response?.data?.error || 'Signup failed';
      setError(message);
    }
  }  

  return React.createElement(
    'div',
    { className: 'login-container' }, // 로그인과 동일한 디자인 재사용
    React.createElement('img', {
      src: '/logo.png',
      alt: 'ChalLedger 로고',
      className: 'login-logo',
    }),
    React.createElement('h1', { className: 'login-title' }, 'Create Your Account'),
    React.createElement(
      'form',
      { className: 'login-form', onSubmit: handleSignup },
    
      // Username input
      React.createElement('input', {
        type: 'text',
        placeholder: 'Username',
        value: username,
        onChange: (e) => setUsername(e.target.value),
        className: 'login-input',
      }),
    React.createElement(
      'form',
      { className: 'login-form', onSubmit: handleSignup },
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
      React.createElement('input', {
        type: 'password',
        placeholder: 'Confirm Password',
        value: confirmPassword,
        onChange: (e) => setConfirmPassword(e.target.value),
        className: 'login-input',
      }),
      React.createElement(
        'button',
        { type: 'submit', className: 'login-button' },
        'Sign Up'
      ),
      error &&
        React.createElement(
          'p',
          { style: { color: 'red', fontSize: '14px', marginTop: '10px' } },
          error
        )
    ),
    React.createElement(
      'p',
      { style: { marginTop: '15px' } },
      'Already have an account? ',
      React.createElement(
        Link,
        { to: '/', style: { color: 'blue', textDecoration: 'none', fontWeight: 'bold' } },
        'Log in'
      )
    )
  )
  );
}

export default SignupPage;
