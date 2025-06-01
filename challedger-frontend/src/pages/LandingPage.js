// src/pages/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function LandingPage() {
  const navigate = useNavigate();

  // Navigation handlers
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

      // Left section: Logo
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

      // Right section: Title, subtitle, buttons, and features
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

        // Buttons: Log In & Create Account
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

         // Feature highlights
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