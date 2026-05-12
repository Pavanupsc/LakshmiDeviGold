import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders jeweller name in navbar', () => {
    render(<App />);
    expect(screen.getByRole('navigation')).toHaveTextContent(/Lakshmi Devi/i);
  });
});
