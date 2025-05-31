// src/pages/MyPage.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer'; 

function MyPage() {
  const [filter, setFilter] = useState('All');
  const [challenges, setChallenges] = useState([]);
  const [badges, setBadges] = useState([]);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');


  // ✅ 배지 이름에 대응되는 이모지 매핑
  const badgeIcons = {
    'First Challenge Badge': '🎉',
    '3-Time Streak': '🏅',
    'Food Budget Destroyer': '💥🍔',
  };

  // ✅ 챌린지 + 유저 정보 불러오기
  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      const email = user.email || 'unknown@example.com';
      const name = user.username || email.split('@')[0];

      setUserEmail(email);
      setUserName(name);

      if (!user || !user.token) {
        console.warn('⛔ No user or token found in localStorage');
        setChallenges([]);
        setBadges([]);
        return;
      }

      try {
        // ✅ 챌린지 불러오기
        const challengeRes = await axios.get('http://localhost:4000/api/challenges/all', {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        const now = new Date();
        const processed = (Array.isArray(challengeRes.data) ? challengeRes.data : [challengeRes.data]).map((c) => {
          const actual = Number(c.actual_spending || 0);
          const goal = Number(c.goal_amount || 1);
          const progress = Math.min(Math.round((actual / goal) * 100), 100);
          const endDate = new Date(c.end_date);
          let status = 'In Progress';

          if (now <= endDate) {
            status = 'In Progress';
          } else if (actual <= goal) {
            status = 'Success';
          } else {
            status = 'Fail';
          }

          return {
            ...c,
            progress,
            status,
          };
        });

        setChallenges(processed);

        // ✅ 배지 불러오기
        const badgeRes = await axios.get('http://localhost:4000/api/badges', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setBadges(badgeRes.data.badges); // [{ badge_name: "First Challenge Badge" }, ...]
      } catch (err) {
        console.error('❌ 데이터 불러오기 실패:', err);
        setError('Failed to load challenges or badges');
      }
    };

    fetchData();
  }, []);
  
  // ✅ 필터링된 챌린지 리스트
  const filteredChallenges =
  filter === 'All'
    ? challenges
    : challenges.filter((c) => c.status === filter);

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
              React.createElement('p',{ key: i },`${c.title || 'Untitled'}`)
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
          badges.length === 0
          ? React.createElement('p', null, 'No badges earned yet.')
          : badges.map((badge, idx) => {
              const name = badge.badge_name || badge.badgeName;
              return React.createElement(
                'div',
                { className: 'badge', key: idx },
                React.createElement('div', { className: 'badge-icon' }, badgeIcons[name] || '🏆'),
                React.createElement('div', { className: 'badge-label' }, name.replace(' Badge', ''))
              );
            })
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
          ['All', 'In Progress', 'Success', 'Fail'].map((f) =>
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
            const statusIcon = c.status === 'Success' ? '✅'
                             : c.status === 'Fail' ? '❌'
                             : '🔄';
            const period = c.period || `${c.start_date?.slice(0, 10)} - ${c.end_date?.slice(0, 10)}`;

            const statusColor =
              c.status === 'Success' ? '#19C197'
              : c.status === 'Fail' ? '#f44336'
              : '#FFC107';
          
            return React.createElement(
              'div',
              {
                key: i,
                className: `history-item ${c.status}`,
                style: {
                  borderLeft: `6px solid ${statusColor}`,
                  borderRadius: '10px',
                  padding: '12px',
                  marginBottom: '10px',
                  backgroundColor: '#fff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                }
              },
              React.createElement('strong', { style: { fontWeight: 'bold' } }, `${statusIcon} ${c.title || 'Untitled'}`),
              React.createElement('p', null, period),
              React.createElement('p', null, `${Number(c.actual_spending || 0).toLocaleString()} / ${Number(c.goal_amount || 1).toLocaleString()} KRW`)
            );
          })          
        )
      )
    ),
        // ✅ Footer 삽입
      React.createElement(Footer)
  );
}

export default MyPage;