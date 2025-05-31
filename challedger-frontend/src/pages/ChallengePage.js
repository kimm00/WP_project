// src/pages/ChallengePage.js
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer'; 

function ChallengePage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Food');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user')) || {};
    const token = user.token;

    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:4000/api/challenges',
        {
          title,
          category,
          goal_amount: goal,
          start_date: startDate,
          end_date: endDate
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert('🎯 챌린지가 성공적으로 등록되었습니다!');
      navigate('/home');
    } catch (err) {
      console.error('❌ 챌린지 등록 실패:', err);
      alert('챌린지 등록 중 오류가 발생했습니다.');
    }
  }

  function goHome() {
    navigate('/home');
  }

  return React.createElement(
    React.Fragment,
    null,

    // Header
    React.createElement(Header),

    // Main challenge container
    React.createElement(
      'div',
      { className: 'challenge-container' },

      // Header area
      React.createElement(
        'div',
        { className: 'challenge-header' },
        React.createElement('img', {
          src: '/logo.png',
          alt: 'ChalLedger Logo',
          className: 'record-logo'
        }),
        React.createElement('button', { className: 'back-button', onClick: goHome }, '← Back to Home')
      ),

      // Title
      React.createElement('h1', { className: 'challenge-title' }, '🎯 Create a New Challenge'),

      // Form
      React.createElement(
        'form',
        { className: 'challenge-form', onSubmit: handleSubmit },

        React.createElement('label', null, 'Challenge Title'),
        React.createElement('input', {
          type: 'text',
          value: title,
          onChange: (e) => setTitle(e.target.value),
          className: 'challenge-input',
          placeholder: 'ex. Weekly Food Budget'
        }),

        React.createElement('label', null, 'Category'),
        React.createElement(
          'select',
          {
            value: category,
            onChange: (e) => setCategory(e.target.value),
            className: 'challenge-input'
          },
          ['Food', 'Transport', 'Shopping', 'Others'].map((c) =>
            React.createElement('option', { key: c, value: c }, c)
          )
        ),

        React.createElement('label', null, 'Goal Amount (KRW)'),
        React.createElement('input', {
          type: 'number',
          value: goal,
          onChange: (e) => setGoal(e.target.value),
          className: 'challenge-input',
          required: true
        }),

        React.createElement('label', null, 'Start Date'),
        React.createElement('input', {
          type: 'date',
          value: startDate,
          onChange: (e) => setStartDate(e.target.value),
          className: 'challenge-input'
        }),

        React.createElement('label', null, 'End Date'),
        React.createElement('input', {
          type: 'date',
          value: endDate,
          onChange: (e) => setEndDate(e.target.value),
          className: 'challenge-input'
        }),

        React.createElement(
          'button',
          { type: 'submit', className: 'challenge-button' },
          '✅ Start Challenge'
        )
      )
    ),

    // ✅ Footer 삽입
    React.createElement(Footer)
  );
}

export default ChallengePage;
