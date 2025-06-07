// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api'; // Shared Axios instance for API requests

function HomePage() {
  const navigate = useNavigate(); // Used for page navigation

  // Format today's date like "Monday, June 3, 2025"
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const [challenges, setChallenges] = useState([]); // Store current challenges
  const [error, setError] = useState(''); // Store any error message

  useEffect(() => {
    // Fetch active challenges from the backend on component mount
    const fetchChallenges = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user')) || {};
        const token = user.token;

        // Call API to get current challenges
        const res = await api.get('/api/challenges/current', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Ensure the result is always an array
        const list = Array.isArray(res.data) ? res.data : [res.data];
        setChallenges(list);
      } catch (err) {
        console.error('❌ Failed to fetch current challenges:', err);
        setError('Unable to fetch current challenges.');
      }
    };

    fetchChallenges();
  }, []);

  // Navigation functions
  const goToRecord = () => navigate('/record');       // Go to spending record page
  const goToChallenge = () => navigate('/challenge'); // Go to challenge creation page
  const goToStats = () => navigate('/stats');         // Go to statistics page
  const goToExpenseList = () => navigate('/expenses'); // Go to expense history page

  return React.createElement(
    React.Fragment,
    null,

    // Top site header
    React.createElement(Header),

    React.createElement(
      'div',
      { className: 'page-wrapper' },

    // Main content area
    React.createElement(
      'div',
      { className: 'home-container' },

      // Site logo and welcome message
      React.createElement('img', {
        src: '/logo.png',
        alt: 'ChalLedger Logo',
        className: 'home-logo',
      }),
      React.createElement('h1', { className: 'home-title' }, 'Welcome back to ChalLedger!'),
      React.createElement('p', { className: 'home-date' }, today),

      // Challenge summary section
      React.createElement(
        'div',
        { className: 'challenge-summary' },
        React.createElement('h2', null, 'Current Challenges'),

        // Show error or challenge list
        error
          ? React.createElement('p', { style: { color: 'gray' } }, error)
          : challenges.length === 0
          ? React.createElement('p', null, 'No challenges right now.')
          : challenges.map((c, i) => (
            React.createElement(
              'div',
              { key: i, style: { marginBottom: '16px' } },

              // Challenge title
              React.createElement('p', { style: { fontWeight: 'bold', marginBottom: '4px' } },
                `🎯 ${c.title || 'Untitled'}`),

              // Challenge target condition
              React.createElement('p', null,
                `- Spend less than ${Number(c.goal_amount).toLocaleString()} KRW on ${c.category.toLowerCase()}`),

              // Challenge current progress
              React.createElement('p', null,
                `- Current spending: ${Number(c.actual_spending || 0).toLocaleString()} KRW`)
            )
          ))
      ),

      // Button section for navigation
      React.createElement(
        'div',
        { className: 'home-buttons' },

        // New challenge button
        React.createElement('button', {
          className: 'home-btn',
          onClick: goToChallenge
        }, '📍 New Challenge'),

        // Record spending button (highlighted)
        React.createElement('button', {
          className: 'home-btn home-btn-highlight',
          onClick: goToRecord
        }, '🧾 Track Your Spending'),

        // View statistics button
        React.createElement('button', {
          className: 'home-btn',
          onClick: goToStats
        }, '📊 View Your Progress'),

        // View expense history button (new)
        React.createElement('button', {
          className: 'home-btn',
          onClick: goToExpenseList
        }, '📜 View Expense History')
      )
    )
  ),

    // Bottom site footer
    React.createElement(Footer)
  );
}

export default HomePage;
