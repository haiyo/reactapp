import { render, screen } from '@testing-library/react';
import App from './App';

test('renders ShootstaTube', () => {
    render(<App />);
    const linkElement = screen.getByText(/ShootstaTube/i);
    expect(linkElement).toBeInTheDocument();
});
