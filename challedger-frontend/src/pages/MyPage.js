// src/pages/MyPage.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer'; 

function MyPage() {
  const [filter, setFilter] = useState('All');
  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [badges, setBadges] = useState([]);

  // 뱃지 목록
  const badgeIcons = {
    'First Challenge': '🎉',
    '3-Time Streak': '🏅',
    'Challenge Achiever': '🎯',
    'Perfect Saver': '🧊',
    'Transport Tracker': '🚗',
    'Food Budget Destroyer': '💥🍔',
    'Shopping Spree': '🛍️',
    'Entertainment Lover': '🎬🎮',
    'Health First': '💪🏋️‍♂️',
    'Travel Budgeter': '✈️🌍',
    'Lifelong Learner': '📚',
    'Bill Payer': '🧾',
    'Pet Lover': '🐾',
    'Gift Giver': '🎁',
    'Explorer': '🧭',
    'Cafe Enthusiast': '☕️',
    'Everyday Essentials': '🛒',
    'Savings Superstar': '⭐️💵',
  };

  // ✅ 사용자 챌린지 목록 불러오기
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
        const challengeRes = await axios.get('http://localhost:4000/api/challenges/all', {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        // 진행률 계산
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
            status = 'Success'; // ✅ 예산 초과 안 했으면 성공
          } else {
            status = 'Fail'; // ✅ 초과한 경우만 실패
          }

          return {
            ...c,
            progress,
            status,
          };
        });

        setChallenges(processed);
        const badgeRes = await axios.get('http://localhost:4000/api/badges', {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        const uniqueBadges = Array.from(
          new Map(badgeRes.data.badges.map(b => [b.badge_name, b])).values()
        );
        setBadges(uniqueBadges);        

      } catch (err) {
        console.error('❌ Failed to load current challenges or badges:', err);
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
          : [...challenges]
              .sort((a, b) => new Date(b.end_date) - new Date(a.end_date))
              .map((c, i) =>
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
                  { className: 'badge-card', key: idx },
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
          [...filteredChallenges]
            .sort((a, b) => new Date(b.end_date) - new Date(a.end_date))
            .map((c, i) => {
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