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
  
      // ✅ 로그인 성공 시 토큰과 사용자 이메일 저장
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('email', res.data.email);
  
      // ✅ 에러 초기화 및 페이지 이동
      setError('');
      navigate('/home'); // 홈 페이지로 이동
    } catch (err) {
      console.error('❌ 로그인 실패:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Login failed');
    }
  }  

  return React.createElement(
    'div',
    { className: 'login-container' },
    
    // 로고
    React.createElement('img', {
      src: '/logo.png',
      alt: 'ChalLedger 로고',
      className: 'login-logo',
    }),

    // 타이틀
    React.createElement('h1', { className: 'login-title' }, 'Welcome to ChalLedger!'),

    // 로그인 폼
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

      // 에러 메시지 출력
      error &&
        React.createElement(
          'p',
          { style: { color: 'red', fontSize: '14px', marginTop: '10px' } },
          error
        )
    ),

    // 회원가입 링크
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
