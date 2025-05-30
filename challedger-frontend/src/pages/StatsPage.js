import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#19C197', '#F95C2F', '#FFC940', '#8884d8'];

function StatsPage() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [error, setError] = useState('');
  const [challenges, setChallenges] = useState([]);
  const [progressError, setProgressError] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user')) || {};
        const token = user.token;
        const month = new Date().toISOString().slice(0, 7);

        const res = await axios.get(`http://localhost:4000/api/expenses?month=${month}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setExpenses(res.data);
        processChartData(res.data);
      } catch (err) {
        console.error('❌ 소비 데이터 조회 실패:', err);
        setError('소비 데이터를 불러오는 데 실패했습니다.');
      }
    };

    const fetchChallengeProgress = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user')) || {};
        const token = user.token;
        const res = await axios.get('http://localhost:4000/api/challenges/progress', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChallenges(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (err) {
        console.error('❌ 착용 진행률 조회 실패:', err);
        setProgressError('진행 중인 착용이 없습니다.');
      }
    };

    fetchExpenses();
    fetchChallengeProgress();
  }, []);

  function processChartData(data) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyMap = {};
    const categoryMap = {};

    data.forEach((item) => {
      const dateObj = new Date(item.date);
      const day = days[dateObj.getDay()];
      dailyMap[day] = (dailyMap[day] || 0) + Number(item.amount);

      const cat = item.category;
      categoryMap[cat] = (categoryMap[cat] || 0) + Number(item.amount);
    });

    const dailyList = days.map((day) => ({
      date: day,
      amount: dailyMap[day] || 0,
    }));

    const categoryList = Object.entries(categoryMap).map(([key, value]) => ({
      name: key,
      value,
    }));

    setDailyData(dailyList);
    setCategoryData(categoryList);
  }

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Header),
    React.createElement('div', { className: 'page-wrapper' },

      challenges.length > 0 && React.createElement(
        'div',
        { className: 'challenge-list' },
        challenges.map((challenge, idx) =>
          React.createElement('div', { key: idx, className: 'section-box challenge-highlight' },
            React.createElement('h2', { className: 'record-title' }, `🎯 ${challenge.category} Challenge`),
            React.createElement('div', { className: 'challenge-flex' },
              React.createElement('div', { className: 'challenge-info' },
                React.createElement('p', null, React.createElement('strong', null, 'Category:'), ' ', challenge.category),
                React.createElement('p', null, React.createElement('strong', null, 'Goal:'), ' ', challenge.goalAmount.toLocaleString(), ' KRW'),
                React.createElement('p', null, React.createElement('strong', null, 'Current Spending:'), ' ', challenge.actualSpending.toLocaleString(), ' KRW'),
                React.createElement('p', null, React.createElement('strong', null, 'Progress:'), ' ', challenge.percent + '%'),
                challenge.isExceeded ? (
                  React.createElement('p', { className: 'status-text danger' }, '⚠ Budget Exceeded!')
                ) : (
                  React.createElement('p', { className: 'status-text success' }, '✔ You\'re on track!')
                )
              ),
              React.createElement('div', { className: 'donut-chart-box' },
                (() => {
                  const progress = challenge.percent;
      
                  return React.createElement(PieChart, { width: 150, height: 150 },
                    React.createElement(Pie, {
                      data: [
                        { name: 'Progress', value: progress },
                        { name: 'Remaining', value: 100 - progress }
                      ],
                      dataKey: 'value',
                      cx: '50%',
                      cy: '50%',
                      innerRadius: 50,
                      outerRadius: 70,
                      startAngle: 90,
                      endAngle: -270,
                      isAnimationActive: true,
                      animationDuration: 1000,
                      label: () => null,
                      labelLine: false
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
                    }, `${progress}%`)
                  );
                })()
              )
            )
          )
        )
      ),

      progressError && React.createElement('div', { className: 'section-box' },
        React.createElement('h2', { className: 'record-title' }, '🎯 Challenge Progress'),
        React.createElement('p', { style: { fontSize: '16px', color: 'gray', marginTop: '8px' } }, progressError)
      ),

      React.createElement('div', { className: 'section-box' },
        React.createElement('h2', { className: 'record-title' }, '📊 Spending Overview'),
        error && React.createElement('p', { style: { color: 'red' } }, error),
        React.createElement(ResponsiveContainer, { width: '100%', height: 300 },
          React.createElement(BarChart, { data: dailyData },
            React.createElement(XAxis, { dataKey: 'date' }),
            React.createElement(YAxis),
            React.createElement(Tooltip),
            React.createElement(Bar, { dataKey: 'amount', fill: '#19C197', radius: [4, 4, 0, 0] })
          )
        )
      ),

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
              outerRadius: 80,               // ✅ innerRadius 제거, 원형 차트
              label: function renderLabel({ percent }) {
                return `${(percent * 100).toFixed(0)}%`; // ✅ 라벨 텍스트 표시
              },
              labelLine: false               // ✅ 라벨 선 제거 (선택사항)
            },
              categoryData.map((entry, index) =>
                React.createElement(Cell, {
                  key: `cell-${index}`,
                  fill: COLORS[index % COLORS.length]
                })
              )
            ),
            React.createElement(Tooltip, null),
            React.createElement(Legend, null)
          )
        )
      )      
    )
  );
}

export default StatsPage;