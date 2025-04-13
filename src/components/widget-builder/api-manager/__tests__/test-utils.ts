
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiConfig } from '@/types/api-types';

// Sample API data for testing
export const mockApis: ApiConfig[] = [
  {
    id: 'api-1',
    name: 'Test API',
    endpoint: 'https://api.example.com/data',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer test-token'
    },
    parameters: {
      'param1': 'value1',
      'param2': 'value2'
    },
    responseMapping: {
      'field1': 'response.data.field1',
      'field2': 'response.data.field2'
    },
    sampleResponse: '{"data":{"field1":"value1","field2":"value2"}}',
    possibleFields: ['response.data.field1', 'response.data.field2']
  },
  {
    id: 'api-2',
    name: 'Another API',
    endpoint: 'https://api.example.com/other',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    parameters: {},
    responseMapping: {},
    sampleResponse: '',
    possibleFields: []
  }
];

// Mock toast function for testing
export const mockToast = {
  toast: jest.fn(),
  dismiss: jest.fn()
};

// Customized render for components that need toast context
export const renderWithToast = (ui: React.ReactElement) => {
  jest.mock('@/hooks/use-toast', () => ({
    useToast: () => mockToast
  }));
  
  return {
    user: userEvent.setup(),
    ...render(ui)
  };
};
