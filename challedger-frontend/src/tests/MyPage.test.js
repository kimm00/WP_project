// src/tests/MyPage.test.js
import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import MyPage from '../pages/MyPage';
import { MemoryRouter } from 'react-router-dom';

// ✅ Mock the API module
jest.mock('../services/api', () => ({
  get: jest.fn()
}));
import api from '../services/api';

describe('MyPage', () => {
  const mockUser = {
    token: 'mock-token',
    email: 'test@example.com',
    username: 'TestUser',
  };

  beforeEach(() => {
    // ✅ Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key) => {
          if (key === 'user') return JSON.stringify(mockUser);
          return null;
        }),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });

    // ✅ Mock API responses
    api.get.mockImplementation((url) => {
      if (url === '/api/challenges/all') {
        return Promise.resolve({
          data: [
            {
              title: 'Food Challenge',
              actual_spending: 20000,
              goal_amount: 30000,
              start_date: '2024-01-01',
              end_date: '2024-01-31',
            },
            {
              title: 'Transport Tracker',
              actual_spending: 15000,
              goal_amount: 10000,
              start_date: '2024-02-01',
              end_date: '2024-02-28',
            }
          ]
        });
      }

      if (url === '/api/badges') {
        return Promise.resolve({
          data: {
            badges: [
              { badge_name: 'Food Budget Destroyer' },
              { badge_name: 'Transport Tracker' }
            ]
          }
        });
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders user info, badges, and challenge history', async () => {
    // ✅ Render component with router
    render(
      React.createElement(MemoryRouter, null,
        React.createElement(MyPage)
      )
    );

    // ✅ User info should appear
    expect(await screen.findByText('TestUser')).toBeInTheDocument();
    expect(await screen.findByText('test@example.com')).toBeInTheDocument();

    // ✅ Check badges section
    const badgeSection = await screen.findByText('Badges');
    const badgeBox = badgeSection.closest('.section-box');
    const badgeScope = within(badgeBox);

    expect(badgeScope.getByText('Food Budget Destroyer')).toBeInTheDocument();
    expect(badgeScope.getByText('Transport Tracker')).toBeInTheDocument();

    // ✅ Check challenge section
    const challengeTitle = await screen.findByText('My Challenges');
    const challengeBox = challengeTitle.closest('.section-box');
    const challengeScope = within(challengeBox);

    expect(challengeScope.getByText('Food Challenge')).toBeInTheDocument();
    expect(challengeScope.getByText('Transport Tracker')).toBeInTheDocument();
  });

  it('filters challenge history by status', async () => {
    render(
      React.createElement(MemoryRouter, null,
        React.createElement(MyPage)
      )
    );

    await screen.findByText('Challenge History');

    const historySection = await screen.findByText('Challenge History');
    const historyBox = historySection.closest('.section-box');
    const historyScope = within(historyBox);

    // ✅ Click "Success" filter and check result
    fireEvent.click(screen.getByText('Success'));
    await waitFor(() => {
      expect(historyScope.getByText(/✅ Food Challenge/)).toBeInTheDocument();
    });

    // ✅ Click "Fail" filter and check result
    fireEvent.click(screen.getByText('Fail'));
    await waitFor(() => {
      expect(historyScope.getByText(/❌ Transport Tracker/)).toBeInTheDocument();
    });

    // ✅ Click "All" filter and check both results
    fireEvent.click(screen.getByText('All'));
    await waitFor(() => {
      expect(historyScope.getByText(/✅ Food Challenge/)).toBeInTheDocument();
      expect(historyScope.getByText(/❌ Transport Tracker/)).toBeInTheDocument();
    });
  });
});
