// src/pages/ExpenseListPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api';

function ExpenseListPage() {
  const [expenses, setExpenses] = useState([]); // Stores the list of expenses
  const [error, setError] = useState('');       // Stores any error message
  const navigate = useNavigate();               // For navigation to other pages

  // Load all expense records when the component mounts
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user')) || {};
        const token = user.token;

        // Fetch all expenses from the backend
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

  // Delete a specific expense by its ID
  const deleteExpense = async (expenseId) => {
    const user = JSON.parse(localStorage.getItem('user')) || {};

    if (!user || !user.token) {
      alert('You must be logged in to delete expenses.');
      return;
    }

    try {
      // Send DELETE request to backend
      await api.delete(`/api/expenses/${expenseId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      // Update local state to remove the deleted expense
      setExpenses((prev) => prev.filter((e) => e.id !== expenseId));

      alert('✅ Expense has been successfully deleted!');
    } catch (err) {
      console.error('❌ Failed to delete expense:', err);
      alert('Failed to delete expense.');
    }
  };

  // Navigate back to the home page
  function goHome() {
    navigate('/home');
  }

  // Return the page layout using React.createElement instead of JSX
  return React.createElement(
    React.Fragment,
    null,

    // Header component at the top
    React.createElement(Header),

    React.createElement(
      'div',
      { className: 'page-wrapper' },

    // Main content container
    React.createElement(
      'div',
      { className: 'expense-list-container' },

      // Logo and back navigation button
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

      // Title of the page
      React.createElement('h1', { className: 'expense-list-title' }, '💸 Expense History'),

      // Display error if any
      error ? React.createElement('p', { style: { color: 'red' } }, error) : null,

      // List of expenses or message when empty
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
                // Decorative left bar
                React.createElement('div', { className: 'expense-colored-bar' }),

                // Main content of each expense card
                React.createElement(
                  'div',
                  { className: 'expense-card-content' },
                  React.createElement('p', null, item.category || 'Unknown'),                // Expense category
                  React.createElement('strong', null, item.description),                    // Description
                  React.createElement('strong', null, `${Number(item.amount).toLocaleString()} KRW`), // Amount
                  React.createElement('p', null, new Date(item.date).toLocaleDateString()) // Date
                ),

                // Delete button for this expense
                React.createElement(
                  'button',
                  {
                    className: 'expense-delete-button',
                    onClick: () => {
                      if (window.confirm('Are you sure you want to delete this expense?')) {
                        deleteExpense(item.id);
                      }
                    }
                  },
                  'Delete'
                )
              )
            )
          )
        )
    ),

    // Footer component at the bottom
    React.createElement(Footer)
  );
}

export default ExpenseListPage;