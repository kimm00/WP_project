// src/pages/SignupPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSignup(event) {
    event.preventDefault();

    // 간단한 비밀번호 확인 검사
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // TODO: 실제 회원가입 API 요청 처리
    console.log('회원가입 시도:', email, password);

    // 성공 시 로그인 페이지로 이동
    navigate('/');
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
  );
}

export default SignupPage;
