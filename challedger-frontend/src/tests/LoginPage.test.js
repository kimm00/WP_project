import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

test('renders login form correctly', () => {
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

  // 타이틀, 인풋, 버튼 확인
  expect(screen.getByText('Welcome to ChalLedger!')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  expect(screen.getByText('Login')).toBeInTheDocument();

  // 회원가입 링크 확인
  expect(screen.getByText('Sign up')).toBeInTheDocument();
});

test('allows user to type email and password', () => {
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

  const emailInput = screen.getByPlaceholderText('Email');
  const passwordInput = screen.getByPlaceholderText('Password');

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: '123456' } });

  expect(emailInput.value).toBe('test@example.com');
  expect(passwordInput.value).toBe('123456');
});
