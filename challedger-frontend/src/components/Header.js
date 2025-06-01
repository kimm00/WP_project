// src/components/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return null; // If user is not logged in, do not show header

  // Extract display name from username or email
  const email = user.email || 'unknown@example.com';
  const username = user.username;
  const userDisplayName = username || email.split('@')[0];

  // Handle logout: clear user and go to landing page
  function handleLogout() {
    localStorage.removeItem('user');
    navigate('/');
  }

  // Navigate to MyPage
  function goToMyPage() {
    navigate('/mypage');
  }

  return React.createElement(
    'header',
    { className: 'site-header' },

    // Left section: logo and brand
    React.createElement(
      'div',
      {
        className: 'header-left',
        onClick: () => navigate('/home'),
        style: { cursor: 'pointer' }
      },
      React.createElement('img', {
        src: '/logo.png',
        alt: 'ChalLedger 로고',
        className: 'header-logo'
      }),
      React.createElement('span', { className: 'brand-name' }, 'ChalLedger')
    ),

    // Right section: username and logout button
    React.createElement(
      'div',
      { className: 'header-right' },
      React.createElement(
        'button',
        {
          onClick: goToMyPage,
          className: 'user-email',
          style: { background: 'none', border: 'none', cursor: 'pointer' }
        },
        '👤 ' + userDisplayName
      ),
      React.createElement(
        'button',
        { onClick: handleLogout, className: 'logout-btn' },
        'Logout'
      )
    )
  );
}

export default Header; 