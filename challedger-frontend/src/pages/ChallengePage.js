// src/pages/ChallengePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api'; // Use shared Axios instance

function ChallengePage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Food');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  // List of predefined spending categories
  const categoryOptions = [
    'Food',
    'Transport',
    'Shopping',
    'Entertainment',
    'Health',
    'Education',
    'Cafe',
    'Daily',
    'Bills',
    'Travel',
    'Pets',
    'Gifts',
    'Others'
  ];  

  // Handle form submission and send challenge data to backend
  async function handleSubmit(e) {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user')) || {};
    const token = user.token;

    // Basic input validation
    if (!token) {
      alert('Login is required.');
      return;
    }
    if (!title.trim()) {
      alert('Please enter a challenge title.');
      return;
    }
    if (Number(goal) <= 0) {
      alert('Goal amount must be greater than 0.');
      return;
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      alert('Start date must be before or equal to end date.');
      return;
    }

    try {
      // Send POST request to create a challenge using API instance
      await api.post(
        '/api/challenges',
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

      alert('🎯 Challenge created successfully!');
      navigate('/home');
    } catch (err) {
      console.error('❌ Challenge creation failed:', err);
      alert('An error occurred while creating the challenge.');
    }
  }

  // Navigate back to home
  function goHome() {
    navigate('/home');
  }

  return React.createElement(
    React.Fragment,
    null,

    // Top navigation
    React.createElement(Header),

    // Challenge creation UI
    React.createElement(
      'div',
      { className: 'challenge-container' },

      // Logo + Back button
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

      // Challenge input form
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
          categoryOptions.map((c) =>
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

    // Footer
    React.createElement(Footer)
  );
}

export default ChallengePage;