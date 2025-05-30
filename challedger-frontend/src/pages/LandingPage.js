// src/pages/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function LandingPage() {
  const navigate = useNavigate();

  function goToLogin() {
    navigate('/login');
  }

  function goToSignup() {
    navigate('/signup');
  }

  return React.createElement(
    'div',
    { className: 'landing-container' },
    React.createElement(
      'div',
      { className: 'landing-content' },

      // 좌측 로고 영역
      React.createElement(
        'div',
        { className: 'landing-left' },
        React.createElement('img', {
          src: '/logo-main.png',
          alt: 'ChalLedger Logo',
          className: 'landing-logo',
          'aria-label': 'ChalLedger logo'
        })
      ),

      // 우측 텍스트 영역
      React.createElement(
        'div',
        { className: 'landing-right' },
        React.createElement(
          'h1',
          { className: 'landing-title' },
          'Track Smarter,', React.createElement('br'), 'Save Better 💰'
        ),
        React.createElement(
          'p',
          { className: 'landing-subtitle' },
          'Budget with purpose. Join challenges, earn badges, and master your finances.'
        ),

        // 버튼 그룹
        React.createElement(
          'div',
          { className: 'button-group' },
          React.createElement(
            'button',
            { className: 'btn-login', onClick: goToLogin },
            'Log In'
          ),
          React.createElement(
            'button',
            { className: 'btn-signup', onClick: goToSignup },
            'Create Account'
          )
        ),

        // 특징 나열
        React.createElement(
          'div',
          { className: 'feature-list' },
          React.createElement('div', null, '📅 Join weekly/monthly budget challenges'),
          React.createElement('div', null, '📊 Visualize spending with clean graphs'),
          React.createElement('div', null, '🏆 Collect badges as you succeed')
        )
      )
    )
  );
}

export default LandingPage;