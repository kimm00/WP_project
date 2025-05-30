// src/pages/StatsPage.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

/*
const dummySpendingData = [
  { date: 'Mon', amount: 8000 },
  { date: 'Tue', amount: 12000 },
  { date: 'Wed', amount: 5300 },
  { date: 'Thu', amount: 6400 },
  { date: 'Fri', amount: 3000 },
  { date: 'Sat', amount: 9500 },
  { date: 'Sun', amount: 4100 },
];

const categoryData = [
  { name: 'Food', value: 22000 },
  { name: 'Transport', value: 8000 },
  { name: 'Shopping', value: 4500 },
  { name: 'Others', value: 3000 },
];
*/

const COLORS = ['#19C197', '#F95C2F', '#FFC940', '#8884d8'];

function StatsPage() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [error, setError] = useState('');
  const [challenge, setChallenge] = useState(null);
  const [progressError, setProgressError] = useState('');

  const goHome = () => navigate('/home');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        const month = new Date().toISOString().slice(0, 7); // 'YYYY-MM'

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
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:4000/api/challenges/progress', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChallenge(res.data);
      } catch (err) {
        console.error('❌ 챌린지 진행률 조회 실패:', err);
        setProgressError('진행 중인 챌린지가 없습니다.');
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

  return (
    <>
      <Header />
      <div className="page-wrapper">
        <div className="section-box">
          <button className="back-button" onClick={goHome}>← Back to Home</button>
          <h2 className="record-title">📊 Spending Overview</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#19C197" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="section-box">
          <h2 className="record-title">📂 Category Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="section-box">
          <h2 className="record-title">🎯 Challenge Progress</h2>
          {progressError && (
            <p style={{ fontSize: '16px', color: 'gray', marginTop: '8px' }}>
              {progressError}
            </p>
          )}
          {challenge && (
            <p style={{ fontSize: '16px', marginTop: '8px' }}>
              Category: <strong>{challenge.category}</strong><br />
              Goal: <strong>{challenge.goalAmount.toLocaleString()} KRW</strong><br />
              Current Spending: <strong>{challenge.actualSpending.toLocaleString()} KRW</strong><br />
              Progress: <strong>{challenge.percent}%</strong><br />
              {challenge.isExceeded ? (
                <span style={{ color: 'red', fontWeight: 'bold' }}>⚠ Budget Exceeded!</span>
              ) : (
                <span style={{ color: '#19C197', fontWeight: 'bold' }}>✔ You're on track!</span>
              )}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default StatsPage;
