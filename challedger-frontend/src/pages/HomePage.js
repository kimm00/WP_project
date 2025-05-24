// src/pages/HomePage.js
import React from 'react';

function HomePage() {
  // 오늘 날짜 (영문 포맷)
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return React.createElement(
    'div',
    { className: 'home-container' },

    // 로고 및 환영 메시지
    React.createElement('img', {
      src: '/logo.png',
      alt: 'ChalLedger Logo',
      className: 'home-logo',
    }),
    React.createElement('h1', { className: 'home-title' }, 'Welcome back to ChalLedger!'),
    React.createElement('p', { className: 'home-date' }, today),

    // 현재 진행 중인 챌린지 요약
    React.createElement(
      'div',
      { className: 'challenge-summary' },
      React.createElement('h2', null, 'Current Challenge'),
      React.createElement('p', null, 'This week\'s goal: Spend less than 20,000 KRW on food'),
      React.createElement('p', null, 'Current spending: 15,300 KRW')
    ),

    // 주요 기능 버튼
    React.createElement(
      'div',
      { className: 'home-buttons' },
      React.createElement('button', { className: 'home-btn' }, '📍 New Challenge'),
      React.createElement('button', { className: 'home-btn' }, '🧾 Log Expense'),
      React.createElement('button', { className: 'home-btn' }, '📈 View Stats')
    )
  );
}

export default HomePage;
