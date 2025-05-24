// src/pages/MyPage.js
import React, { useState } from 'react';
import Header from '../components/Header';

function MyPage() {
  const [filter, setFilter] = useState('All');

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const email = user.email || 'unknown@example.com';
  const name = email.split('@')[0]; // 이메일 앞부분을 이름처럼 사용

  // 뱃지 목록
  const badges = [
    { label: '3-Time Streak', icon: '🏅' },
    { label: 'Budget Master', icon: '💰' },
    { label: 'First Challenge', icon: '🎉' },
  ];

  // 챌린지 이력 데이터
  const challengeHistory = [
    { title: 'April Savings', status: 'Completed', progress: 100, period: '2024.04.01 - 04.30' },
    { title: 'May Coffee Budget', status: 'In Progress', progress: 60, period: '2024.05.01 - 05.31' },
    { title: 'February No Shopping', status: 'Completed', progress: 100, period: '2024.02.01 - 02.28' },
  ];

  // 필터링된 챌린지 리스트
  const filteredChallenges =
    filter === 'All' ? challengeHistory : challengeHistory.filter((c) => c.status === filter);

  return React.createElement(
    React.Fragment,
    null,

    React.createElement(Header),

    React.createElement(
      'div',
      { className: 'mypage-container' },

      // 👤 프로필 카드
      React.createElement(
        'div',
        { className: 'profile-card' },
        React.createElement('img', {
          src: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=19C197&color=fff&rounded=true`,
          alt: 'User Avatar',
          className: 'profile-avatar'
        }),
        React.createElement('h2', null, name),
        React.createElement('p', { className: 'user-email' }, email)
      ),

      // 📌 챌린지 진행 중인 항목 요약
      React.createElement(
        'div',
        { className: 'section-box' },
        React.createElement('h3', null, 'My Challenges'),
        React.createElement('p', null, '💼 April Savings Challenge — 80% Complete'),
        React.createElement('p', null, '✈️ March Travel Challenge — 100% Complete')
      ),

      // 🏅 보유한 뱃지
      React.createElement(
        'div',
        { className: 'section-box' },
        React.createElement('h3', null, 'Badges'),
        React.createElement(
          'div',
          { className: 'badge-list' },
          badges.map((badge, idx) =>
            React.createElement(
              'div',
              { className: 'badge', key: idx },
              React.createElement('div', { className: 'badge-icon' }, badge.icon),
              React.createElement('div', { className: 'badge-label' }, badge.label)
            )
          )
        )
      ),

      // 📊 챌린지 이력 + 필터링 기능
      React.createElement(
        'div',
        { className: 'section-box' },
        React.createElement('h3', null, 'Challenge History'),

        // 필터 버튼 그룹
        React.createElement(
          'div',
          { className: 'filter-group' },
          ['All', 'Completed', 'In Progress'].map((f) =>
            React.createElement(
              'button',
              {
                key: f,
                className: filter === f ? 'filter-btn active' : 'filter-btn',
                onClick: () => setFilter(f)
              },
              f
            )
          )
        ),

        // 필터링된 챌린지 리스트
        React.createElement(
          'div',
          { className: 'history-list' },
          filteredChallenges.map((c, i) =>
            React.createElement(
              'div',
              {
                key: i,
                className: `history-item ${c.status.toLowerCase().replace(' ', '-')}`
              },
              React.createElement('strong', null, c.title),
              React.createElement('p', null, c.period),
              React.createElement('p', null, `Progress: ${c.progress}%`)
            )
          )
        )
      )
    )
  );
}

export default MyPage;
