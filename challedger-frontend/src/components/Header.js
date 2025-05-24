// src/components/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return null; // 로그인하지 않은 경우 표시 안 함

    // ✅ 로그아웃 핸들러
    function handleLogout() {
      localStorage.removeItem('user');
      navigate('/');
    }
  
    // ✅ 마이페이지 이동 핸들러
    function goToMyPage() {
      navigate('/mypage');
    }

  return React.createElement(
    'header',
    { className: 'site-header' },

    // 왼쪽: 로고 + 브랜드명
    React.createElement(
      'div',
      { className: 'header-left' , onClick: () => navigate('/home'), style: { cursor: 'pointer' } },
      React.createElement('img', {
        src: '/logo.png',
        alt: 'ChalLedger 로고',
        className: 'header-logo'
      }),
      React.createElement('span', { className: 'brand-name' }, 'ChalLedger')
    ),

    // 오른쪽: 이메일 클릭 시 MyPage, 로그아웃 버튼
    React.createElement(
      'div',
      { className: 'header-right' },
      React.createElement(
        'button',
        {
          onClick: goToMyPage,
          className: 'user-email',
          style: { background: 'none', border: 'none', cursor: 'pointer' }
        },
        '👤 ' + user.email
      ),
      React.createElement(
        'button',
        { onClick: handleLogout, className: 'logout-btn' },
        'Logout'
      )
    )
  );
}

export default Header;
