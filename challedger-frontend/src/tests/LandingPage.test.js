import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';

// Mock useNavigate globally
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(), // we will override it in the test
}));

describe('LandingPage', () => {
  test('renders logo and main texts', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    // Check logo and main messages
    expect(screen.getByAltText('ChalLedger Logo')).toBeInTheDocument();
    expect(screen.getByText(/Track Smarter,/i)).toBeInTheDocument();
    expect(screen.getByText(/Budget with purpose/i)).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  test('navigates to login and signup', () => {
    // Override useNavigate mock
    const mockedUsedNavigate = jest.fn();
    useNavigate.mockReturnValue(mockedUsedNavigate);

    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    // Simulate clicking buttons
    fireEvent.click(screen.getByText('Log In'));
    fireEvent.click(screen.getByText('Create Account'));

    // Check that navigation was triggered
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/login');
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/signup');
  });
});
