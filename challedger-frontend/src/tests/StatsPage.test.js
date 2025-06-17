import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import StatsPage from '../pages/StatsPage';

// api 모킹
jest.mock('../services/api', () => ({
  get: jest.fn(),
}));

// react-calendar 모킹
jest.mock('react-calendar', () => {
  return function MockCalendar({ onChange }) {
    return <div data-testid="calendar" onClick={() => onChange(new Date())}>Mock Calendar</div>;
  };
});

// recharts 내부 요소 모킹 (예: ResponsiveContainer, PieChart 등)
jest.mock('recharts', () => {
  const Original = jest.requireActual('recharts');
  return {
    ...Original,
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
  };
});

// Header/Footer도 필요한 경우 간단히 모킹
jest.mock('../components/Header', () => () => <div>Mock Header</div>);
jest.mock('../components/Footer', () => () => <div>Mock Footer</div>);

import api from '../services/api';

beforeEach(() => {
  localStorage.setItem('user', JSON.stringify({ token: 'test-token' }));

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

    await waitFor(() => {
      expect(screen.getByText(/Weekly Spending Overview/i)).toBeInTheDocument();
    });
  });
});