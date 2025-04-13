
import { renderHook, act } from '@testing-library/react';
import { useApiTable } from '../hooks/useApiTable';
import { mockApis } from './test-utils';

// Mock the useToast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

// Mock the clipboard API
const originalClipboard = { ...global.navigator.clipboard };

beforeEach(() => {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: jest.fn(() => Promise.resolve())
    },
    writable: true
  });
});

afterEach(() => {
  Object.defineProperty(navigator, 'clipboard', {
    value: originalClipboard,
    writable: true
  });
});

describe('useApiTable', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useApiTable());
    
    expect(result.current.searchQuery).toBe('');
    expect(result.current.sortDirection).toBeNull();
    expect(result.current.copyStatus).toEqual({});
  });
  
  it('updates search query when handleSearch is called', () => {
    const { result } = renderHook(() => useApiTable());
    
    act(() => {
      result.current.handleSearch('test query');
    });
    
    expect(result.current.searchQuery).toBe('test query');
  });
  
  it('toggles sort direction when toggleSort is called', () => {
    const { result } = renderHook(() => useApiTable());
    
    // Initial state should be null
    expect(result.current.sortDirection).toBeNull();
    
    // First toggle should set to 'asc'
    act(() => {
      result.current.toggleSort();
    });
    expect(result.current.sortDirection).toBe('asc');
    
    // Second toggle should set to 'desc'
    act(() => {
      result.current.toggleSort();
    });
    expect(result.current.sortDirection).toBe('desc');
  });
  
  it('copies API to clipboard and updates status', async () => {
    const { result } = renderHook(() => useApiTable());
    
    await act(async () => {
      await result.current.copyApiToClipboard(mockApis[0]);
    });
    
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(result.current.copyStatus[mockApis[0].id]).toBe(true);
    
    // Wait for the status to reset
    jest.advanceTimersByTime(2000);
    expect(result.current.copyStatus[mockApis[0].id]).toBe(false);
  });
  
  it('filters and sorts APIs correctly', () => {
    const { result } = renderHook(() => useApiTable());
    
    // Test filtering by name
    act(() => {
      result.current.handleSearch('Test');
    });
    
    let filteredApis = result.current.filterAndSortApis(mockApis);
    expect(filteredApis.length).toBe(1);
    expect(filteredApis[0].name).toBe('Test API');
    
    // Test sorting ascending
    act(() => {
      result.current.handleSearch('');
      result.current.toggleSort();
    });
    
    filteredApis = result.current.filterAndSortApis(mockApis);
    expect(filteredApis.length).toBe(2);
    expect(filteredApis[0].name).toBe('Another API');
    expect(filteredApis[1].name).toBe('Test API');
    
    // Test sorting descending
    act(() => {
      result.current.toggleSort();
    });
    
    filteredApis = result.current.filterAndSortApis(mockApis);
    expect(filteredApis[0].name).toBe('Test API');
    expect(filteredApis[1].name).toBe('Another API');
  });
});
