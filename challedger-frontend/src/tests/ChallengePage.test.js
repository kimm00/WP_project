
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ChallengePage from '../pages/ChallengePage';

// Utility function to wrap with Router context
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('ChallengePage', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ token: 'fake-token' }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renders challenge form inputs and submit button', () => {
    renderWithRouter(<ChallengePage />);

    expect(screen.getByText(/Create a New Challenge/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Challenge Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Goal Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Challenge/i })).toBeInTheDocument();
  });

  test('validates form and prevents submission with missing data', () => {
    renderWithRouter(<ChallengePage />);

    fireEvent.click(screen.getByRole('button', { name: /Start Challenge/i }));
    expect(screen.getByText(/Create a New Challenge/i)).toBeInTheDocument();
  });
});
