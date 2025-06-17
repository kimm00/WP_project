import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ExpenseListPage from '../pages/ExpenseListPage';
import { BrowserRouter } from 'react-router-dom';
import api from '../services/api';

// 모킹
jest.mock('../services/api');
jest.mock('../components/Header', () => () => <div>Mock Header</div>);
jest.mock('../components/Footer', () => () => <div>Mock Footer</div>);

describe('ExpenseListPage', () => {
  const mockExpenses = [
    {
      id: 1,
      category: 'Food',
      description: 'Lunch at cafe',
      amount: 9500,
      date: '2025-06-17'
    },
    {
      id: 2,
      category: 'Transport',
      description: 'Bus fare',
      amount: 1200,
      date: '2025-06-16'
    }
  ];

  const renderWithRouter = () =>
    render(
      <BrowserRouter>
        <ExpenseListPage />
      </BrowserRouter>
    );

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders no expenses if user not logged in or no data', async () => {
    api.get.mockResolvedValueOnce({ data: [] }); // 빈 응답
    localStorage.setItem('user', JSON.stringify({ token: 'fake-token' }));

    renderWithRouter();

    await screen.findByText('No expenses recorded.');
  });

  test('displays fetched expense items', async () => {
    api.get.mockResolvedValueOnce({ data: mockExpenses });
    localStorage.setItem('user', JSON.stringify({ token: 'fake-token' }));

    renderWithRouter();

    // 기다려야 함 (useEffect에서 비동기 호출이므로)
    await waitFor(() => {
      expect(screen.getByText(/Lunch at cafe/i)).toBeInTheDocument();
      expect(screen.getByText(/Bus fare/i)).toBeInTheDocument();
      expect(screen.getByText(/9,500 KRW/i)).toBeInTheDocument();
      expect(screen.getByText(/1,200 KRW/i)).toBeInTheDocument();
    });
  });

  test('delete button triggers delete API call after confirm', async () => {
    api.get.mockResolvedValueOnce({ data: mockExpenses });
    api.delete.mockResolvedValueOnce({});
    localStorage.setItem('user', JSON.stringify({ token: 'fake-token' }));

    // confirm 창 모킹
    window.confirm = jest.fn(() => true);
    window.alert = jest.fn();

    renderWithRouter();

    // 렌더 완료 대기
    await screen.findByText(/Lunch at cafe/);

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();
    await waitFor(() =>
      expect(api.delete).toHaveBeenCalledWith('/api/expenses/1', {
        headers: { Authorization: 'Bearer fake-token' }
      })
    );
  });
});
