
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ApiFormTabs from '../ApiFormTabs';

// Mock the tab content components
jest.mock('../tabs/ApiFormGeneral', () => ({
  __esModule: true,
  default: () => <div data-testid="general-tab">General Tab Content</div>
}));

jest.mock('../tabs/ApiFormHeaders', () => ({
  __esModule: true,
  default: () => <div data-testid="headers-tab">Headers Tab Content</div>
}));

jest.mock('../tabs/ApiFormParams', () => ({
  __esModule: true,
  default: () => <div data-testid="params-tab">Parameters Tab Content</div>
}));

jest.mock('../tabs/ApiFormSample', () => ({
  __esModule: true,
  default: () => <div data-testid="sample-tab">Sample Response Tab Content</div>
}));

jest.mock('../tabs/ApiFormMapping', () => ({
  __esModule: true,
  default: () => <div data-testid="mapping-tab">Response Mapping Tab Content</div>
}));

describe('ApiFormTabs', () => {
  const defaultProps = {
    activeTab: 'general',
    setActiveTab: jest.fn(),
    newApi: {},
    setNewApi: jest.fn(),
    headerKey: '',
    setHeaderKey: jest.fn(),
    headerValue: '',
    setHeaderValue: jest.fn(),
    paramKey: '',
    setParamKey: jest.fn(),
    paramValue: '',
    setParamValue: jest.fn(),
    mappingKey: '',
    setMappingKey: jest.fn(),
    mappingValue: '',
    setMappingValue: jest.fn(),
    handleAddHeader: jest.fn(),
    handleAddParam: jest.fn(),
    handleAddMapping: jest.fn(),
    processSampleResponse: jest.fn()
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the tabs with the correct active tab', () => {
    render(<ApiFormTabs {...defaultProps} />);
    
    // Check that all tab triggers are rendered
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Headers')).toBeInTheDocument();
    expect(screen.getByText('Parameters')).toBeInTheDocument();
    expect(screen.getByText('Sample Response')).toBeInTheDocument();
    expect(screen.getByText('Response Mapping')).toBeInTheDocument();
    
    // Check that the general tab content is visible
    expect(screen.getByTestId('general-tab')).toBeInTheDocument();
  });
  
  it('changes tabs when a tab is clicked', async () => {
    const setActiveTab = jest.fn();
    const user = userEvent.setup();
    
    render(<ApiFormTabs {...defaultProps} setActiveTab={setActiveTab} />);
    
    // Click on the Headers tab
    await user.click(screen.getByText('Headers'));
    
    // Check that setActiveTab was called with 'headers'
    expect(setActiveTab).toHaveBeenCalledWith('headers');
  });
  
  it('shows different content based on active tab', () => {
    const { rerender } = render(<ApiFormTabs {...defaultProps} />);
    
    // General tab should be visible by default
    expect(screen.getByTestId('general-tab')).toBeInTheDocument();
    
    // Change to headers tab
    rerender(<ApiFormTabs {...defaultProps} activeTab="headers" />);
    expect(screen.getByTestId('headers-tab')).toBeInTheDocument();
    
    // Change to parameters tab
    rerender(<ApiFormTabs {...defaultProps} activeTab="params" />);
    expect(screen.getByTestId('params-tab')).toBeInTheDocument();
    
    // Change to sample response tab
    rerender(<ApiFormTabs {...defaultProps} activeTab="sample" />);
    expect(screen.getByTestId('sample-tab')).toBeInTheDocument();
    
    // Change to response mapping tab
    rerender(<ApiFormTabs {...defaultProps} activeTab="mapping" />);
    expect(screen.getByTestId('mapping-tab')).toBeInTheDocument();
  });
});
