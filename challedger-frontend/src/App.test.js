import { render, screen } from '@testing-library/react';
import App from './App';

// Basic test to check if specific text exists in the rendered App
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
