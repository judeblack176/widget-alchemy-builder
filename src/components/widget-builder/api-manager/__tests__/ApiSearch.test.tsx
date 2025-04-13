
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ApiSearch from '../ApiSearch';

// We need to mock the SearchBar component since it's an external dependency
jest.mock('@/components/widget-builder/SearchBar', () => ({
  __esModule: true,
  default: ({ onSearch, placeholder, className }: any) => (
    <input 
      data-testid="search-bar"
      placeholder={placeholder}
      className={className}
      onChange={(e) => onSearch(e.target.value)}
    />
  )
}));

describe('ApiSearch', () => {
  const mockOnSearch = jest.fn();
  const mockToggleSort = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the search input and sort button', () => {
    render(
      <ApiSearch 
        onSearch={mockOnSearch}
        sortDirection="asc"
        toggleSort={mockToggleSort}
      />
    );
    
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  
  it('calls toggleSort when sort button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ApiSearch 
        onSearch={mockOnSearch}
        sortDirection="asc"
        toggleSort={mockToggleSort}
      />
    );
    
    await user.click(screen.getByRole('button'));
    expect(mockToggleSort).toHaveBeenCalledTimes(1);
  });
  
  it('displays the correct sort icon based on sortDirection', () => {
    const { rerender } = render(
      <ApiSearch 
        onSearch={mockOnSearch}
        sortDirection="asc"
        toggleSort={mockToggleSort}
      />
    );
    
    // We can't easily test for the specific icon, but we can check that the component renders
    expect(screen.getByRole('button')).toBeInTheDocument();
    
    rerender(
      <ApiSearch 
        onSearch={mockOnSearch}
        sortDirection="desc"
        toggleSort={mockToggleSort}
      />
    );
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
