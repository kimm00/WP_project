// src/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

//  mock
jest.mock('./pages/LandingPage', () => () => 'Landing Page');
jest.mock('./pages/LoginPage', () => () => 'Login Page');
jest.mock('./pages/SignupPage', () => () => 'Signup Page');
jest.mock('./pages/HomePage', () => () => 'Home Page');
jest.mock('./pages/RecordPage', () => () => 'Record Page');
jest.mock('./pages/ChallengePage', () => () => 'Challenge Page');
jest.mock('./pages/StatsPage', () => () => 'Stats Page');
jest.mock('./pages/MyPage', () => () => 'My Page');

// test
describe('App Routing', () => {
  it('renders LandingPage at root path "/"', () => {
    window.history.pushState({}, '', '/');
    render(React.createElement(App));
    expect(screen.getByText('Landing Page')).toBeInTheDocument();
  });

  it('renders LoginPage at "/login"', () => {
    window.history.pushState({}, '', '/login');
    render(React.createElement(App));
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders SignupPage at "/signup"', () => {
    window.history.pushState({}, '', '/signup');
    render(React.createElement(App));
    expect(screen.getByText('Signup Page')).toBeInTheDocument();
  });

  it('renders HomePage at "/home"', () => {
    window.history.pushState({}, '', '/home');
    render(React.createElement(App));
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('renders RecordPage at "/record"', () => {
    window.history.pushState({}, '', '/record');
    render(React.createElement(App));
    expect(screen.getByText('Record Page')).toBeInTheDocument();
  });

  it('renders ChallengePage at "/challenge"', () => {
    window.history.pushState({}, '', '/challenge');
    render(React.createElement(App));
    expect(screen.getByText('Challenge Page')).toBeInTheDocument();
  });

  it('renders StatsPage at "/stats"', () => {
    window.history.pushState({}, '', '/stats');
    render(React.createElement(App));
    expect(screen.getByText('Stats Page')).toBeInTheDocument();
  });

  it('renders MyPage at "/mypage"', () => {
    window.history.pushState({}, '', '/mypage');
    render(React.createElement(App));
    expect(screen.getByText('My Page')).toBeInTheDocument();
  });
});
