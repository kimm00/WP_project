// src/pages/RecordPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api'; // Use shared Axios instance

function RecordPage() {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Expense categories
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

  // Submit expense to backend
  async function handleSubmit(e) {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user')) || {};
    const token = user.token;

    if (!token) {
      alert('Login required');
      return;
    }

    try {
      await api.post('/api/expenses', {
        amount,
        category,
        date,
        description: note
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('✅ Your spending has been successfully recorded!');
      navigate('/home');
    } catch (err) {
      console.error('❌ Failed to record spending:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'An error occurred while recording your spending.');
    }
  }

  // Navigate back to home
  function goHome() {
    navigate('/home');
  }

  return React.createElement(
    React.Fragment,
    null,
  
    // Header
    React.createElement(Header),
  
    // Wrapper for center alignment and spacing
    React.createElement(
      'div',
      { className: 'page-wrapper' },
  
      // Expense form container
      React.createElement(
        'div',
        { className: 'record-container' },
  
        // Logo
        React.createElement('img', {
          src: '/logo.png',
          alt: 'ChalLedger Logo',
          className: 'record-logo'
        }),
  
        // Back button
        React.createElement(
          'button',
          { className: 'back-button', onClick: goHome },
          '← Back to Home'
        ),
  
        // Title
        React.createElement('h1', { className: 'record-title' }, '🧾 Record Your Expense'),
  
        // Input form
        React.createElement(
          'form',
          { className: 'record-form', onSubmit: handleSubmit },
  
          React.createElement('label', null, 'Date'),
          React.createElement('input', {
            type: 'date',
            value: date,
            onChange: (e) => setDate(e.target.value),
            className: 'record-input'
          }),
  
          React.createElement('label', null, 'Amount (KRW)'),
          React.createElement('input', {
            type: 'number',
            value: amount,
            onChange: (e) => setAmount(e.target.value),
            className: 'record-input',
            required: true
          }),
  
          React.createElement('label', null, 'Category'),
          React.createElement(
            'select',
            {
              value: category,
              onChange: (e) => setCategory(e.target.value),
              className: 'record-input'
            },
            categoryOptions.map((opt) =>
              React.createElement('option', { key: opt, value: opt }, opt)
            )
          ),
  
          React.createElement('label', null, 'Note (optional)'),
          React.createElement('input', {
            type: 'text',
            value: note,
            onChange: (e) => setNote(e.target.value),
            className: 'record-input'
          }),
  
          React.createElement(
            'button',
            { type: 'submit', className: 'record-button' },
            '💾 Save Expense'
          ),
  
          // Error display
          error &&
            React.createElement(
              'p',
              { style: { color: 'red', fontSize: '14px', marginTop: '10px' } },
              error
            )
        )
      )
    ),

    // Footer section
    React.createElement(Footer)
  );
}

export default RecordPage;