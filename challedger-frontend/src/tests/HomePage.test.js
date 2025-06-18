import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';

// Mock Header and Footer components
jest.mock('../components/Header', () => () => <div>Mocked Header</div>);
jest.mock('../components/Footer', () => () => <div>Mocked Footer</div>);

// Mock API call (returns empty challenge list)
jest.mock('../services/api', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] }))
}));

describe('HomePage', () => {
  test('renders logo and welcome message', async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Check if logo and main text content appear
    expect(screen.getByAltText(/challedger logo/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome back to ChalLedger/i)).toBeInTheDocument();
    expect(screen.getByText(/Current Challenges/i)).toBeInTheDocument();
  });

  test('renders navigation buttons', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Check for all navigation buttons
    expect(screen.getByText(/New Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Track Your Spending/i)).toBeInTheDocument();
    expect(screen.getByText(/View Your Progress/i)).toBeInTheDocument();
  });
});
