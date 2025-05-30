// src/pages/ChallengePage.js
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

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

  return (
    <>
      <Header />
      <div className="challenge-container">
        <div className="challenge-header">
          <img
            src="/logo.png"
            alt="ChalLedger Logo"
            className="record-logo" // TODO: Rename to challenge-logo or page-logo for clarity
          />
          <button className="back-button" onClick={goHome}>
            ← Back to Home
          </button>
        </div>

        <h1 className="challenge-title">
          🎯 Create a New Challenge
        </h1>

        <form className="challenge-form" onSubmit={handleSubmit}>
          <label>Challenge Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="challenge-input"
            placeholder="ex. Weekly Food Budget"
          />

          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="challenge-input"
          >
            {['Food', 'Transport', 'Shopping', 'Others'].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <label>Goal Amount (KRW)</label>
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="challenge-input"
            required
          />

          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="challenge-input"
          />

          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="challenge-input"
          />

          <button type="submit" className="challenge-button">
            ✅ Start Challenge
          </button>
        </form>
      </div>
    </>
  );
}

export default ChallengePage;