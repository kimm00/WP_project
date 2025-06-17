import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

test('renders login form correctly', () => {
  // Render the LoginPage component inside a memory router
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

  // Check if the main title is displayed
  expect(screen.getByText('Welcome to ChalLedger!')).toBeInTheDocument();

  // Check if input fields are displayed
  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

  // Check if login button is displayed
  expect(screen.getByText('Login')).toBeInTheDocument();

  // Check if sign-up link is displayed
  expect(screen.getByText('Sign up')).toBeInTheDocument();
});

test('allows user to type email and password', () => {
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

  // Get the input fields
  const emailInput = screen.getByPlaceholderText('Email');
  const passwordInput = screen.getByPlaceholderText('Password');

  // Simulate typing into the fields
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: '123456' } });

  // Check if the input values are correctly updated
  expect(emailInput.value).toBe('test@example.com');
  expect(passwordInput.value).toBe('123456');
});