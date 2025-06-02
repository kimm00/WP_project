import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignupPage from '../pages/SignupPage';

// Mock API
jest.mock('../services/api', () => ({
  post: jest.fn(() => Promise.resolve({ data: { message: 'User registered successfully' } }))
}));

describe('SignupPage', () => {
  it('renders signup form fields', () => {
    render(<BrowserRouter><SignupPage /></BrowserRouter>);
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    render(<BrowserRouter><SignupPage /></BrowserRouter>);

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: '654321' } });

    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
  });
});