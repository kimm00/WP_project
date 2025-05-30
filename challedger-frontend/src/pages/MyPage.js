// src/pages/MyPage.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';

function MyPage() {
  const [filter, setFilter] = useState('All');
  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // 뱃지 목록
  const badges = [
    { label: '3-Time Streak', icon: '🏅' },
    { label: 'Budget Master', icon: '💰' },
    { label: 'First Challenge', icon: '🎉' },
  ];

  // ✅ 사용자 챌린지 목록 불러오기
  useEffect(() => {
    const fetchChallenges = async () => {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      const email = user.email || 'unknown@example.com';
      const name = user.username || email.split('@')[0];

      setUserEmail(email);
      setUserName(name);
  
      if (!user || !user.token) {
        console.warn('⛔ No user or token found in localStorage');
        setChallenges([]);
        return;
      }
  
      try {
        const res = await axios.get('http://localhost:4000/api/challenges/all', {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        // 진행률 계산
        const processed = (Array.isArray(res.data) ? res.data : [res.data]).map((c) => {
          const actual = Number(c.actual_spending || 0);
          const goal = Number(c.goal_amount || 1);
          const progress = Math.min(Math.round((actual / goal) * 100), 100);

          return {
            ...c,
            progress,
          };
        });

        setChallenges(processed);
      } catch (err) {
        console.error('❌ 챌린지 불러오기 실패:', err);
        setError('Failed to load challenges');
      }
    };
  
    fetchChallenges();
  }, []);

  // ✅ 필터링된 챌린지 리스트
  const filteredChallenges =
    filter === 'All'
      ? challenges
      : filter === 'Completed'
      ? challenges.filter((c) => c.progress === 100)
      : challenges.filter((c) => c.progress < 100);

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
          src: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=19C197&color=fff&rounded=true`,
          alt: 'User Avatar',
          className: 'profile-avatar'
        }),
        React.createElement('h2', { className: 'user-name' }, userName),
        React.createElement('p', { className: 'user-email' }, userEmail),        
      ),

      // 📌 챌린지 개요
      React.createElement(
        'div',
        { className: 'section-box' },
        React.createElement('h3', null, 'My Challenges'),
        challenges.length === 0
          ? React.createElement('p', null, 'No challenges yet.')
          : challenges.map((c, i) =>
              React.createElement(
                'p',
                { key: i },
                `${c.title || 'Untitled'} — ${c.progress}% Complete`
              )
            )
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

      // 📊 챌린지 이력
      React.createElement(
        'div',
        { className: 'section-box' },
        React.createElement('h3', null, 'Challenge History'),
        error && React.createElement('p', { style: { color: 'red' } }, error),

        // 필터 버튼
        React.createElement(
          'div',
          { className: 'filter-group' },
          ['All', 'Completed', 'In Progress'].map((f) =>
            React.createElement(
              'button',
              {
                key: f,
                className: filter === f ? 'filter-btn active' : 'filter-btn',
                onClick: () => setFilter(f),
              },
              f
            )
          )
        ),

        // 필터링된 챌린지 리스트
        React.createElement(
          'div',
          { className: 'history-list' },
          filteredChallenges.map((c, i) => {
            const status = c.progress === 100 ? 'Completed' : 'In Progress';
            const statusClass = status.toLowerCase().replace(' ', '-');
            const period = c.period || `${c.start_date?.slice(0, 10)} - ${c.end_date?.slice(0, 10)}`;

            return React.createElement(
              'div',
              {
                key: i,
                className: `history-item ${statusClass}`
              },
              React.createElement('strong', null, `${status === 'Completed' ? '✅' : '🔄'} ${c.title || 'Untitled'}`),
              React.createElement('p', null, period),
              React.createElement('p', null, `Progress: ${c.progress}%`)
            );
      })
        )
      )
    )
  );
}

export default MyPage;