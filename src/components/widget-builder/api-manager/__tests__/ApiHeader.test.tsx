
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ApiHeader from '../ApiHeader';

describe('ApiHeader', () => {
  const mockOnCreateSampleApi = jest.fn();
  const mockSetIsDialogOpen = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the header with title and buttons', () => {
    render(
      <ApiHeader 
        onCreateSampleApi={mockOnCreateSampleApi} 
        setIsDialogOpen={mockSetIsDialogOpen} 
      />
    );
    
    expect(screen.getByText('APIs')).toBeInTheDocument();
    expect(screen.getByText('Add Sample API')).toBeInTheDocument();
    expect(screen.getByText('Add API')).toBeInTheDocument();
  });
  
  it('calls onCreateSampleApi when "Add Sample API" is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ApiHeader 
        onCreateSampleApi={mockOnCreateSampleApi} 
        setIsDialogOpen={mockSetIsDialogOpen} 
      />
    );
    
    await user.click(screen.getByText('Add Sample API'));
    expect(mockOnCreateSampleApi).toHaveBeenCalledTimes(1);
  });
  
  it('calls setIsDialogOpen when "Add API" is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ApiHeader 
        onCreateSampleApi={mockOnCreateSampleApi} 
        setIsDialogOpen={mockSetIsDialogOpen} 
      />
    );
    
    await user.click(screen.getByText('Add API'));
    expect(mockSetIsDialogOpen).toHaveBeenCalledWith(true);
  });
});
