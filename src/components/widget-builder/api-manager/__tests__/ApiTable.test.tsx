
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ApiTable from '../ApiTable';
import { mockApis } from './test-utils';

// Mock the Tooltip components
jest.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipContent: ({ children }: any) => <div data-testid="tooltip-content">{children}</div>,
  TooltipProvider: ({ children }: any) => <div>{children}</div>,
  TooltipTrigger: ({ asChild, children }: any) => 
    asChild ? children : <div data-testid="tooltip-trigger">{children}</div>,
}));

describe('ApiTable', () => {
  const mockOnCopy = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnRemove = jest.fn();
  const mockCopyStatus = { 'api-1': false, 'api-2': true };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the table with API data', () => {
    render(
      <ApiTable 
        apis={mockApis}
        copyStatus={mockCopyStatus}
        onCopy={mockOnCopy}
        onEdit={mockOnEdit}
        onRemove={mockOnRemove}
      />
    );
    
    expect(screen.getByText('Test API')).toBeInTheDocument();
    expect(screen.getByText('Another API')).toBeInTheDocument();
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('POST')).toBeInTheDocument();
    expect(screen.getAllByText('Endpoint:').length).toBe(2);
  });
  
  it('displays a message when no APIs match the filter', () => {
    render(
      <ApiTable 
        apis={[]}
        copyStatus={mockCopyStatus}
        onCopy={mockOnCopy}
        onEdit={mockOnEdit}
        onRemove={mockOnRemove}
      />
    );
    
    expect(screen.getByText('No matching APIs found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search query')).toBeInTheDocument();
  });
  
  it('calls onEdit when the edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ApiTable 
        apis={mockApis}
        copyStatus={mockCopyStatus}
        onCopy={mockOnCopy}
        onEdit={mockOnEdit}
        onRemove={mockOnRemove}
      />
    );
    
    // Find all edit buttons
    const editButtons = screen.getAllByRole('button').filter(button => {
      // Filter based on the presence of the Code icon - this is a simplification
      // In a real test, you might need a better way to identify the edit buttons
      return button.innerHTML.includes('Code');
    });
    
    await user.click(editButtons[0]);
    expect(mockOnEdit).toHaveBeenCalledWith('api-1');
  });
  
  it('calls onRemove when the remove button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ApiTable 
        apis={mockApis}
        copyStatus={mockCopyStatus}
        onCopy={mockOnCopy}
        onEdit={mockOnEdit}
        onRemove={mockOnRemove}
      />
    );
    
    // Find all remove buttons
    const removeButtons = screen.getAllByRole('button').filter(button => {
      // Filter based on the presence of the Trash2 icon
      return button.innerHTML.includes('Trash2');
    });
    
    await user.click(removeButtons[0]);
    expect(mockOnRemove).toHaveBeenCalledWith('api-1');
  });
});
