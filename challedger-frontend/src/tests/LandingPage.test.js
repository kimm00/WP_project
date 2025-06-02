import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';

describe('LandingPage', () => {
  test('renders logo and main texts', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    expect(screen.getByAltText('ChalLedger Logo')).toBeInTheDocument();
    expect(screen.getByText(/Track Smarter,/i)).toBeInTheDocument();
    expect(screen.getByText(/Budget with purpose/i)).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  test('navigates to login and signup', () => {
    const mockedUsedNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockedUsedNavigate,
    }));

    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Log In'));
    fireEvent.click(screen.getByText('Create Account'));
  });
});
