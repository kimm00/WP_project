// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api'; // Use shared Axios instance

function HomePage() {
  const navigate = useNavigate();

  // Format today's date (e.g., "Monday, June 3, 2025")
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch current challenges from the backend
    const fetchChallenges = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user')) || {};
        const token = user.token;

        // Call the current challenges API with auth header
        const res = await api.get('/api/challenges/current', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const list = Array.isArray(res.data) ? res.data : [res.data];
        setChallenges(list);
      } catch (err) {
        console.error('❌ Failed to fetch current challenges:', err);
        setError('Unable to fetch current challenges.');
      }
    };

    fetchChallenges();
  }, []);

  // Navigation handlers
  const goToRecord = () => navigate('/record');
  const goToChallenge = () => navigate('/challenge');
  const goToStats = () => navigate('/stats');

  return React.createElement(
    React.Fragment,
    null,

    // Top header
    React.createElement(Header),

    // Main container
    React.createElement(
      'div',
      { className: 'home-container' },

      // Logo and greeting
      React.createElement('img', {
        src: '/logo.png',
        alt: 'ChalLedger Logo',
        className: 'home-logo',
      }),
      React.createElement('h1', { className: 'home-title' }, 'Welcome back to ChalLedger!'),
      React.createElement('p', { className: 'home-date' }, today),

      // Challenge summary
      React.createElement(
        'div',
        { className: 'challenge-summary' },
        React.createElement('h2', null, 'Current Challenges'),
        error
          ? React.createElement('p', { style: { color: 'gray' } }, error)
          : challenges.length === 0
          ? React.createElement('p', null, 'No challenges right now.')
          : challenges.map((c, i) => (
            React.createElement(
              'div',
              { key: i, style: { marginBottom: '16px' } },
              React.createElement('p', { style: { fontWeight: 'bold', marginBottom: '4px' } }, `🎯 ${c.title || 'Untitled'}`),
              React.createElement('p', null, `- Spend less than ${Number(c.goal_amount).toLocaleString()} KRW on ${c.category.toLowerCase()}`),
              React.createElement('p', null, `- Current spending: ${Number(c.actual_spending || 0).toLocaleString()} KRW`)
            )
          ))
      ),

      // Navigation buttons
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
    ),
    
    // Footer
    React.createElement(Footer)
  );
}

export default HomePage;