import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer'; 
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Color palette for charts
const COLORS = [
  '#19C197', '#F95C2F', '#FFC940', '#8884d8',
  '#FF7F50', '#00BFFF', '#ADFF2F', '#FF69B4',
  '#A52A2A', '#20B2AA', '#DAA520', '#9370DB',
  '#4682B4'
];

// Emoji icons for categories
const categoryEmojis = {
  Food: '🍽',
  Transport: '🚇',
  Shopping: '🛍',
  Entertainment: '🎬',
  Health: '🏥',
  Education: '📚',
  Cafe: '☕️',
  Daily: '🛒',
  Bills: '🧾',
  Travel: '✈️',
  Pets: '🐶',
  Gifts: '🎁',
  Others: '💸'
};

function StatsPage() {
  const navigate = useNavigate();
  const [, setExpenses] = useState([]);
  const [calendarExpenses, setCalendarExpenses] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [error, setError] = useState('');
  const [challenges, setChallenges] = useState([]);
  const [progressError, setProgressError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartDate] = useState(new Date());

  // Filter calendar data for selected day
  const filteredExpenses = calendarExpenses.filter(item =>
    new Date(item.date).toDateString() === selectedDate.toDateString()
  );

  const goHome = () => navigate('/home');

  // Fetch expenses for calendar view
  useEffect(() => {
    const fetchCalendarExpenses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user')) || {};
        const token = user.token;
        const month = selectedDate.getFullYear() + '-' + (selectedDate.getMonth() + 1).toString().padStart(2, '0');

        const res = await axios.get(`http://localhost:4000/api/expenses?month=${month}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCalendarExpenses(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch spending data for calendar view:', err);
      }
    };

    fetchCalendarExpenses();
  }, [selectedDate]);

  // Fetch active challenge progress
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user')) || {};
        const token = user.token;
        const res = await axios.get('http://localhost:4000/api/challenges/progress', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = Array.isArray(res.data) ? res.data : [res.data];
        setChallenges(list);
      } catch (err) {
        console.error('❌ Failed to fetch ongoing challenges:', err);
        setProgressError('No ongoing challenges found.');
      }
    };
  
    fetchChallenges();
  }, []);

  // Group expense data by day and category for charts
  const processChartData = useCallback((data) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dailyMap = {};
    const categoryMap = {};

    const startOfWeek = new Date(chartDate);
    const day = startOfWeek.getDay();
    const diff = (day === 0 ? -6 : 1 - day);
    startOfWeek.setDate(chartDate.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weeklyData = data.filter(item => {
      const date = new Date(item.date);
      return date >= startOfWeek && date <= endOfWeek;
    });

    weeklyData.forEach(item => {
      const d = new Date(item.date);
      const jsDay = d.getDay();
      const isoDay = jsDay === 0 ? 6 : jsDay - 1;
      const dayName = days[isoDay];
  
      dailyMap[dayName] = (dailyMap[dayName] || 0) + Number(item.amount);
      categoryMap[item.category] = (categoryMap[item.category] || 0) + Number(item.amount);
    });

    setDailyData(days.map(day => ({ date: day, amount: dailyMap[day] || 0 })));
    setCategoryData(Object.entries(categoryMap).map(([name, value]) => ({ name, value })));
  }, [chartDate]);

  // Fetch weekly expenses and generate chart data
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user')) || {};
        const token = user.token;
        const month = chartDate.toISOString().slice(0, 7);
        const res = await axios.get(`http://localhost:4000/api/expenses?month=${month}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(res.data);
        processChartData(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch spending data:', err);
        setError('Failed to load your spending data.');
      }
    };

    fetchExpenses();
  }, [chartDate, processChartData]);
   // UI rendering skipped here for brevity
   
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Header),
    React.createElement('div', { className: 'page-wrapper' },

      // Spending Overview
      React.createElement('div', { className: 'section-box' },
        React.createElement('button', { className: 'back-button', onClick: goHome }, '← Back to Home'),
        React.createElement('h2', { className: 'record-title' }, '📊 Spending Overview'),
        error && React.createElement('p', { className: 'error' }, error),
        React.createElement(ResponsiveContainer, { width: '100%', height: 300 },
          React.createElement(BarChart, { data: dailyData },
            React.createElement(XAxis, { dataKey: 'date' }),
            React.createElement(YAxis),
            React.createElement(Tooltip),
            React.createElement(Bar, { dataKey: 'amount', fill: '#19C197', radius: [4, 4, 0, 0] })
          )
        )
      ),

      // Category Breakdown
      React.createElement('div', { className: 'section-box' },
        React.createElement('h2', { className: 'record-title' }, '📂 Category Breakdown'),
        React.createElement(ResponsiveContainer, { width: '100%', height: 300 },
          React.createElement(PieChart, null,
            React.createElement(Pie, {
              data: categoryData,
              dataKey: 'value',
              nameKey: 'name',
              cx: '50%',
              cy: '50%',
              outerRadius: 100,
              label: true
            },
              categoryData.map((entry, idx) =>
                React.createElement(Cell, {
                  key: `cell-${idx}`,
                  fill: COLORS[idx % COLORS.length]
                })
              )
            ),
            React.createElement(Tooltip),
            React.createElement(Legend)
          )
        )
      ),

      // Calendar + Details
      React.createElement('div', { className: 'section-box' },
        React.createElement('h2', { className: 'record-title' }, '🗓 Daily Expense Calendar'),
        React.createElement('div', { className: 'calendar-grid' },
          React.createElement('div', { className: 'calendar-box' },
            React.createElement(Calendar, {
              onChange: setSelectedDate,
              value: selectedDate
            })
          ),
          React.createElement('div', { className: 'calendar-details' },
            React.createElement('h3', null,
              '📅 ',
              React.createElement('strong', null, selectedDate.toDateString())
            ),
            filteredExpenses.length === 0
              ? React.createElement('p', { className: 'no-expense' }, 'No expenses on this day.')
              : React.createElement(React.Fragment, null,
                React.createElement('ul', { className: 'expense-list' },
                  filteredExpenses.map((e, i) =>
                    React.createElement('li', { key: i },
                      `${categoryEmojis[e.category] || '💸'} ${e.category}: ${e.description ? e.description + ' - ' : ''}${Number(e.amount).toLocaleString()} KRW`
                    )                    
                  )
                ),
                React.createElement('p', { className: 'total-expense' },
                  'Total: ',
                  React.createElement('strong', null,
                    `${filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0).toLocaleString()} KRW`
                  )
                )
              )
          )
        )
      ),

      // Challenge Progress
      React.createElement('div', { className: 'section-box' },
        React.createElement('h2', { className: 'record-title' }, '🎯 Challenge Spending Ratio'),
      
        progressError && React.createElement(
          'p',
          { style: { fontSize: '16px', color: 'gray', marginTop: '8px' } },
          progressError
        ),
      
        React.createElement('div', { className: 'challenge-grid' },
          challenges.map((c, i) =>
            React.createElement('div', { key: i, className: 'challenge-card' }, [
              React.createElement('h3', { style: { fontWeight: '600', marginBottom: '10px' } },
                `🎯 ${c.title || 'Weekly ' + c.category + ' budget'}`),
      
              React.createElement('p', null, `Category: ${c.category}`),
              React.createElement('p', null, `Goal: ${Number(c.goalAmount || c.goal_amount).toLocaleString()} KRW`),
              React.createElement('p', null, `Current Spending: ${Number(c.actualSpending || c.actual_spending || 0).toLocaleString()} KRW`),
              React.createElement('p', null, `Spending Ratio: ${c.percent || c.progress || 0}%`),
      
              React.createElement('div', { className: 'donut-chart-box', style: { marginTop: '16px' } },
                React.createElement(PieChart, { width: 150, height: 150 },
                  React.createElement(Pie, {
                    data: [
                      { name: 'spendingRatio', value: c.percent || c.progress || 0 },
                      { name: 'Remaining', value: 100 - (c.percent || c.progress || 0) }
                    ],
                    dataKey: 'value',
                    cx: '50%',
                    cy: '50%',
                    innerRadius: 50,
                    outerRadius: 70,
                    startAngle: 90,
                    endAngle: -270,
                    labelLine: false,
                    label: () => null
                  },
                    React.createElement(Cell, { fill: '#19C197' }),
                    React.createElement(Cell, { fill: '#e0e0e0' })
                  ),
                  React.createElement('text', {
                    x: '50%',
                    y: '50%',
                    textAnchor: 'middle',
                    dominantBaseline: 'middle',
                    fontSize: 16,
                    fontWeight: 'bold',
                    fill: '#333'
                  }, `${c.percent || c.progress || 0}%`)
                )
              )
            ])
          )
        )
      )      
    ),

    // Footer
    React.createElement(Footer)
  );
}

export default StatsPage;