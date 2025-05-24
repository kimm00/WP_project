// src/pages/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function HomePage() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  // 버튼 클릭 핸들러
  const goToRecord = () => navigate('/record');
  const goToChallenge = () => navigate('/challenge');
  const goToStats = () =>navigate('/stats');

  return React.createElement(
    React.Fragment,
    null,

    // ✅ Header는 페이지 바깥에 위치
    React.createElement(Header),

    // ✅ 본문 콘텐츠는 별도 wrapper에
    React.createElement(
      'div',
      { className: 'home-container' },

      // 로고 + 타이틀
      React.createElement('img', {
        src: '/logo.png',
        alt: 'ChalLedger Logo',
        className: 'home-logo',
      }),
      React.createElement('h1', { className: 'home-title' }, 'Welcome back to ChalLedger!'),
      React.createElement('p', { className: 'home-date' }, today),

      // 챌린지 정보
      React.createElement(
        'div',
        { className: 'challenge-summary' },
        React.createElement('h2', null, 'Current Challenge'),
        React.createElement('p', null, "This week's goal: Spend less than 20,000 KRW on food"),
        React.createElement('p', null, 'Current spending: 15,300 KRW')
      ),

      // 버튼 영역
      React.createElement(
        'div',
        { className: 'home-buttons' },
        React.createElement('button', {
          className: 'home-btn',
          onClick: goToChallenge
        }, '📍 New Challenge'),

        React.createElement('button', {
          className: 'home-btn home-btn-highlight',
          onClick: goToRecord
        }, '🧾 Track Your Spending'),

        React.createElement('button', {
          className: 'home-btn',
          onClick: goToStats
        }, '📊 View Your Progress')
      )
    )
  );
}

export default HomePage;