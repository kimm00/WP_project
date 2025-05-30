// src/pages/RecordPage.js
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function RecordPage() {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token'); // 로그인 후 저장된 토큰

      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      await axios.post('http://localhost:4000/api/expenses', {
        amount,
        category,
        date,
        description: note
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('✅ 소비가 성공적으로 등록되었습니다!');
      navigate('/home');
    } catch (err) {
      console.error('❌ 소비 등록 실패:', err.response?.data || err.message);
      setError(err.response?.data?.error || '소비 등록 중 오류 발생');
    }
  }

  function goHome() {
    navigate('/home');
  }

  return React.createElement(
    React.Fragment,
    null,

    // ✅ 상단 헤더 고정
    React.createElement(Header),

    // ✅ 내용 카드
    React.createElement(
      'div',
      { className: 'record-container' },

      // ✅ 로고 단독 상단 표시
      React.createElement('img', {
        src: '/logo.png',
        alt: 'ChalLedger Logo',
        className: 'record-logo'
      }),

      // ✅ 돌아가기 버튼을 h1 위에 두기 (더 자연스럽게)
      React.createElement(
        'button',
        { className: 'back-button', onClick: goHome },
        '← Back to Home'
      ),

      // ✅ 제목
      React.createElement('h1', { className: 'record-title' }, '🧾 Record Your Expense'),

      // ✅ 입력 폼
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
          ['Food', 'Transport', 'Shopping', 'Others'].map((opt) =>
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

        error &&
          React.createElement(
            'p',
            { style: { color: 'red', fontSize: '14px', marginTop: '10px' } },
            error
          )
      )
    )
  );
}

export default RecordPage;