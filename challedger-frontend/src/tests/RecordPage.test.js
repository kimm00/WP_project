import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RecordPage from '../pages/RecordPage';
import { BrowserRouter } from 'react-router-dom';
import api from '../services/api'; // ✅ 수정된 경로

// 모킹
jest.mock('../services/api');
jest.mock('../components/Header', () => () => <div>Mock Header</div>);
jest.mock('../components/Footer', () => () => <div>Mock Footer</div>);

describe('RecordPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function renderWithRouter() {
    render(
      <BrowserRouter>
        <RecordPage />
      </BrowserRouter>
    );
  }

  test('renders title and submit button', () => {
    renderWithRouter();
    expect(screen.getByText(/🧾 Record Your Expense/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /💾 Save Expense/i })).toBeInTheDocument();
  });

  test('shows alert if not logged in', () => {
    renderWithRouter();
    window.alert = jest.fn();

    fireEvent.click(screen.getByRole('button', { name: /💾 Save Expense/i }));

    expect(window.alert).toHaveBeenCalledWith('Login required');
  });

  test('submits form successfully with token', async () => {
    api.post.mockResolvedValueOnce({});
    localStorage.setItem('user', JSON.stringify({ token: 'fake-token' }));

    renderWithRouter();

    const amountInput = screen.getByRole('spinbutton'); // input[type="number"]
    fireEvent.change(amountInput, { target: { value: '10000' } });

    fireEvent.click(screen.getByRole('button', { name: /💾 Save Expense/i }));

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