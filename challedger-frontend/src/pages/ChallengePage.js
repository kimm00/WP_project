// src/pages/ChallengePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChallengePage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Food');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    console.log('🎯 챌린지 등록:', { title, category, goal, startDate, endDate });
    alert('Challenge saved!');
    navigate('/home'); // ✅ 저장 후 홈으로 이동
  }

  function goHome() {
    navigate('/home');
  }

  return React.createElement(
    'div',
    { className: 'challenge-container' },

    // 상단 로고 및 홈 버튼
    React.createElement(
      'div',
      { className: 'challenge-header' },
      React.createElement('img', {
        src: '/logo.png',
        alt: 'ChalLedger Logo',
        className: 'record-logo'
      }),
      React.createElement(
        'button',
        { className: 'back-button', onClick: goHome },
        '← Back to Home'
      )
    ),

    // 타이틀
    React.createElement('h1', { className: 'challenge-title' }, '🎯 Create a New Challenge'),

    // 입력 폼
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
  );
}

export default ChallengePage;