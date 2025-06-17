// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import all page components
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import RecordPage from './pages/RecordPage';
import ChallengePage from './pages/ChallengePage';
import StatsPage from './pages/StatsPage';
import MyPage from './pages/MyPage';
import ExpenseListPage from './pages/ExpenseListPage'; 

function App() {
  return React.createElement(
    Router, // Provides routing functionality for the entire application
    null,
    React.createElement(
      Routes, // Contains all individual route definitions
      null,

      // Route for landing page (default)
      React.createElement(Route, {
        path: '/',
        element: React.createElement(LandingPage)
      }),

      // Route for login page
      React.createElement(Route, {
        path: '/login',
        element: React.createElement(LoginPage)
      }),

      // Route for signup page
      React.createElement(Route, {
        path: '/signup',
        element: React.createElement(SignupPage)
      }),

      // Route for home page (after login)
      React.createElement(Route, {
        path: '/home',
        element: React.createElement(HomePage) 
      }),

      // Route for recording expenses
      React.createElement(Route, {
        path: '/record',
        element: React.createElement(RecordPage) 
      }),

      // Route for creating new challenges
      React.createElement(Route, {
        path: '/challenge',
        element: React.createElement(ChallengePage)
      }),

      // Route for viewing statistics and analytics
      React.createElement(Route, {
        path: '/stats',
        element: React.createElement(StatsPage)
      }),

      // Route for user profile or badge page
      React.createElement(Route, {
        path: '/mypage',
        element: React.createElement(MyPage)
      }),

      // Route for viewing and deleting expense history
      React.createElement(Route, {
        path: '/expenses',
        element: React.createElement(ExpenseListPage)
      })
    )
  );
}

export default App;
