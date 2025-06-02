import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RecordPage from '../pages/RecordPage';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../services/api', () => ({
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

// ✅ 모의 유저 세팅
beforeEach(() => {
  const mockUser = {
    email: 'test@example.com',
    username: 'TestUser',
    token: 'mockToken'
  };
  window.localStorage.setItem('user', JSON.stringify(mockUser));
});

// ✅ 모의 alert 설정
beforeAll(() => {
  window.alert = jest.fn();
});

// ✅ 렌더 함수
function renderRecordPage() {
  return render(
    <BrowserRouter>
      <RecordPage />
    </BrowserRouter>
  );
}

test('renders RecordPage form and submits data', async () => {
  renderRecordPage();

  // ✅ ID 기반 label 찾기
  fireEvent.change(screen.getByLabelText(/Date/i), {
    target: { value: '2025-06-02' }
  });

  fireEvent.change(screen.getByLabelText(/Amount/i), {
    target: { value: '10000' }
  });

  fireEvent.change(screen.getByLabelText(/Category/i), {
    target: { value: 'Food' }
  });

  fireEvent.change(screen.getByLabelText(/Note/i), {
    target: { value: 'Lunch' }
  });

  fireEvent.click(screen.getByRole('button', { name: /Save Expense/i }));

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith(
      '✅ Your spending has been successfully recorded!'
    );
  });
});
