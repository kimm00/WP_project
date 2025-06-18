import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import StatsPage from '../pages/StatsPage';

// Mock API module
jest.mock('../services/api', () => ({
  get: jest.fn(),
}));

// Mock react-calendar to simulate a simple date picker
jest.mock('react-calendar', () => {
  return function MockCalendar({ onChange }) {
    return (
      <div data-testid="calendar" onClick={() => onChange(new Date())}>
        Mock Calendar
      </div>
    );
  };
});

// Mock recharts component to avoid rendering actual charts
jest.mock('recharts', () => {
  const Original = jest.requireActual('recharts');
  return {
    ...Original,
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
  };
});

// Mock Header and Footer components
jest.mock('../components/Header', () => () => <div>Mock Header</div>);
jest.mock('../components/Footer', () => () => <div>Mock Footer</div>);

// Import mocked api after jest.mock
import api from '../services/api';

beforeEach(() => {
  // Set mock user token in localStorage
  localStorage.setItem('user', JSON.stringify({ token: 'test-token' }));

  // Define API mock responses
  api.get.mockImplementation((url) => {
    if (url.startsWith('/api/expenses')) {
      return Promise.resolve({
        data: [
          {
            date: new Date().toISOString(),
            amount: 5000,
            category: 'Food',
            description: 'Lunch',
          },
        ],
      });
    }

    if (url === '/api/challenges/progress') {
      return Promise.resolve({
        data: [
          {
            title: 'Test Challenge',
            category: 'Food',
            goalAmount: 30000,
            actualSpending: 15000,
            percent: 50,
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });
});

afterEach(() => {
  // Clean up mocks after each test
  jest.clearAllMocks();
  localStorage.clear();
});

describe('StatsPage', () => {
  test('renders Weekly Spending Overview section', async () => {
    render(
      <Router>
        <StatsPage />
      </Router>
    );

    // Check for presence of key text after API data loads
    await waitFor(() => {
      expect(screen.getByText(/Weekly Spending Overview/i)).toBeInTheDocument();
    });
  });
});