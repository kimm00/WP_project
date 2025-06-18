import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RecordPage from '../pages/RecordPage';
import { BrowserRouter } from 'react-router-dom';
import api from '../services/api'; // API module import

// Mocking external modules
jest.mock('../services/api');
jest.mock('../components/Header', () => () => <div>Mock Header</div>);
jest.mock('../components/Footer', () => () => <div>Mock Footer</div>);

describe('RecordPage', () => {
  // Clear localStorage before each test
  beforeEach(() => {
    localStorage.clear();
  });

  // Utility function to render with router context
  function renderWithRouter() {
    render(
      <BrowserRouter>
        <RecordPage />
      </BrowserRouter>
    );
  }

  test('renders title and submit button', () => {
    renderWithRouter();

    // Check if title and save button are rendered
    expect(screen.getByText(/🧾 Record Your Expense/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /💾 Save Expense/i })
    ).toBeInTheDocument();
  });

  test('shows alert if not logged in', () => {
    renderWithRouter();

    // Mock alert function
    window.alert = jest.fn();

    // Try clicking the save button without login
    fireEvent.click(screen.getByRole('button', { name: /💾 Save Expense/i }));

    // Expect alert message to be shown
    expect(window.alert).toHaveBeenCalledWith('Login required');
  });

  test('submits form successfully with token', async () => {
    // Mock successful POST response
    api.post.mockResolvedValueOnce({});
    localStorage.setItem('user', JSON.stringify({ token: 'fake-token' }));

    renderWithRouter();

    // Fill in the amount field
    const amountInput = screen.getByRole('spinbutton');
    fireEvent.change(amountInput, { target: { value: '10000' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /💾 Save Expense/i }));

    // Expect API call with correct data and auth header
    expect(api.post).toHaveBeenCalledWith(
      '/api/expenses',
      expect.objectContaining({
        amount: '10000',
        category: 'Food',
        date: expect.any(String),
        description: ''
      }),
      expect.objectContaining({
        headers: { Authorization: 'Bearer fake-token' }
      })
    );
  });
});