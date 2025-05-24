// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // 에러 메시지 상태
  const navigate = useNavigate();

  function handleLogin(event) {
    event.preventDefault();

    // 여기서는 임시로 조건문으로 로그인 확인 (실제 프로젝트에서는 API 요청 사용)
    if (email === 'user@example.com' && password === '1234') {
      setError('');
      navigate('/home'); // 로그인 성공 시 대시보드 등으로 이동
    } else {
      setError('Incorrect email or password');
    }
  }

  return React.createElement(
    'div',
    { className: 'login-container' },
    React.createElement('img', {
      src: '/logo.png',
      alt: 'ChalLedger 로고',
      className: 'login-logo',
    }),
    React.createElement('h1', { className: 'login-title' }, 'Welcome to ChalLedger!'),
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
      "Don’t have an account? ",
      React.createElement(
        Link,
        { to: '/signup', style: { color: 'blue', textDecoration: 'none', fontWeight: 'bold' } },
        'Sign up'
      )
    )
  );
}

export default LoginPage;