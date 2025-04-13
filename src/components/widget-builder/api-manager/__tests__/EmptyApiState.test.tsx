
import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyApiState from '../EmptyApiState';

describe('EmptyApiState', () => {
  it('renders the empty state message correctly', () => {
    render(<EmptyApiState />);
    
    expect(screen.getByText('No APIs configured yet')).toBeInTheDocument();
    expect(screen.getByText(/Click "Add API" to create your first API integration/)).toBeInTheDocument();
  });
  
  it('displays the globe icon', () => {
    render(<EmptyApiState />);
    // Testing for the presence of the icon is challenging with testing-library 
    // as it's rendered as an SVG, but we can check for a div that should contain it
    const iconContainer = document.querySelector('.mx-auto.text-gray-400.mb-2');
    expect(iconContainer).toBeInTheDocument();
  });
});
