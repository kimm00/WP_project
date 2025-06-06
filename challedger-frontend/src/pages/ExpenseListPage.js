// src/pages/ExpenseListPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api';

function ExpenseListPage() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user')) || {};
        const token = user.token;
        const res = await api.get('/api/expenses/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExpenses(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch expenses:', err);
        setError('Failed to load expenses');
      }
    };

    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      const token = user.token;
      await api.delete(`/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(expenses.filter((e) => e.id !== id));
    } catch (err) {
      console.error('❌ Failed to delete expense:', err);
      alert('Failed to delete');
    }
  };

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
      { className: 'expense-list-container' },

      // Logo + Back button
      React.createElement(
        'div',
        { className: 'expense-list-header' },
        React.createElement('img', {
          src: '/logo.png',
          alt: 'ChalLedger Logo',
          className: 'record-logo'
        }),
        React.createElement('button', { className: 'back-button', onClick: goHome }, '← Back to Home')
      ),
      
      // Title
      React.createElement('h1', { className: 'expense-list-title' }, '💸 Expense History'),

      // Error message
      error ? React.createElement('p', { style: { color: 'red' } }, error) : null,

      // Expense List
      expenses.length === 0
        ? React.createElement('p', null, 'No expenses recorded.')
        : React.createElement(
            'div',
            { className: 'expense-list-box' },
            expenses.map((item) =>
              React.createElement(
                'div',
                {
                  key: item.id,
                  className: 'expense-colored-card'
                },
                React.createElement('div', { className: 'expense-colored-bar' }),
                React.createElement(
                  'div',
                  { className: 'expense-card-content' },
                  React.createElement('p', { className: 'expense-description' }, item.description),
                  React.createElement('strong', null, item.category || 'Unknown'),
                  React.createElement('p', null, `${Number(item.amount).toLocaleString()} KRW`),
                  React.createElement('p', null, new Date(item.date).toLocaleDateString())
                ),
                React.createElement(
                  'button',
                  {
                    className: 'expense-delete-button',
                    onClick: () => {
                      if (window.confirm('Are you sure you want to delete this?')) {
                        handleDelete(item.id);
                      }
                    }
                  },
                  '🗑 Delete'
                )
              )
            )
          )
    ),

    React.createElement(Footer)
  );
}

export default ExpenseListPage;