// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import RecordPage from './pages/RecordPage';
import ChallengePage from './pages/ChallengePage';
import StatsPage from './pages/StatsPage';
import MyPage from './pages/MyPage';

function App() {
  return React.createElement(
    Router,
    null,
    React.createElement(
      Routes,
      null,
      React.createElement(Route, {
        path: '/',
        element: React.createElement(LoginPage)
      }),
      React.createElement(Route, {
        path: '/signup',
        element: React.createElement(SignupPage)
      }),
      React.createElement(Route, {
        path: '/home',
        element: React.createElement(HomePage) 
      }),
      React.createElement(Route, {
        path: '/record',
        element: React.createElement(RecordPage) 
      }),
      React.createElement(Route, {
        path: '/challenge',
        element: React.createElement(ChallengePage)
      }),
      React.createElement(Route, {
        path: '/stats',
        element: React.createElement(StatsPage)
      }),
      React.createElement(Route, {
        path: '/mypage',
        element: React.createElement(MyPage)
      })
    )
  );
}

export default App;
