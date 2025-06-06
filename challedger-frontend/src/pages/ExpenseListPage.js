// src/pages/ExpenseListPage.js
import React, { useEffect, useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api';

function ExpenseListPage() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');
  //const navigate = useNavigate();

  //const goHome = () => navigate('/home');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user')) || {};
        const token = user.token;
        const res = await api.get('/api/expenses', {
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

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Header),

    React.createElement(
      'div',
      { className: 'record-container' },
      React.createElement('h2', null, '💸 Expense History'),

      error ? React.createElement('p', { style: { color: 'red' } }, error) : null,

      expenses.length === 0
        ? React.createElement('p', null, 'No expenses recorded.')
        : React.createElement(
            'ul',
            { className: 'expense-list' },
            expenses.map((item) =>
              React.createElement(
                'li',
                {
                  key: item.id,
                  className: 'expense-item',
                  style: {
                    marginBottom: '10px',
                    padding: '10px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                  }
                },
                React.createElement('strong', null, item.category || 'Unknown'),
                React.createElement('p', null, `${item.amount.toLocaleString()} KRW`),
                React.createElement('p', null, new Date(item.date).toLocaleDateString()),
                React.createElement(
                    'button',
                    {
                      onClick: () => {
                        if (window.confirm('Are you sure you want to delete this?')) {
                          handleDelete(item.id);
                        }
                      },
                      style: {
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '6px'
                      }
                    },
                    'Delete'
                  )                  
              )
            )
          )
    ),

    React.createElement(Footer)
  );
}

export default ExpenseListPage;