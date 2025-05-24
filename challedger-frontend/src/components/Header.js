// src/components/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return null; // 로그인하지 않은 경우 표시 안 함

  function handleLogout() {
    localStorage.removeItem('user');
    navigate('/');
  }

  return React.createElement(
    'header',
    { className: 'site-header' },

    // 왼쪽: 로고 + 브랜드명
    React.createElement(
      'div',
      { className: 'header-left' },
      React.createElement('img', {
        src: '/logo.png',
        alt: 'ChalLedger 로고',
        className: 'header-logo'
      }),
      React.createElement('span', { className: 'brand-name' }, 'ChalLedger')
    ),

    // 오른쪽: 이메일 + 로그아웃
    React.createElement(
      'div',
      { className: 'header-right' },
      React.createElement('span', { className: 'user-email' }, '👤 ' + user.email),
      React.createElement(
        'button',
        { onClick: handleLogout, className: 'logout-btn' },
        'Logout'
      )
    )
  );
}

export default Header;
