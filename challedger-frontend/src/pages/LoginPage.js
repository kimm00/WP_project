// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleLogin(event) {
    event.preventDefault();

    // 예시: 임시 로그인 로직 (실제 프로젝트에서는 API 요청 필요)
    if (email === 'user@example.com' && password === '1234') {
      setError('');
      localStorage.setItem('user', JSON.stringify({ email })); // 로그인 상태 저장
      navigate('/home'); // 홈으로 이동
    } else {
      setError('Incorrect email or password');
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
