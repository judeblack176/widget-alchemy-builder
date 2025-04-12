
import React from 'react';
import { WidgetComponent } from '@/types/widget-types';
import { 
  Header, Text, Image, Button, Video, Chart, Form, 
  Calendar, Dropdown, Link, MultiText, Filter, Alert, 
  Table, SearchBar 
} from './components';

export const renderComponent = (
  component: WidgetComponent, 
  apiData?: Record<string, any>,
  onAlertDismiss?: (alertId: string) => void
) => {
  const { type, props } = component;
  
  // Process API field mappings for the component
  let processedProps = { ...props };
  
  // Handle API field mappings
  if (component.apiFieldMappings && component.apiFieldMappings.length > 0 && apiData) {
    // Get the API data for this component based on the apiId
    const componentApiData = component.apiConfig?.apiId ? apiData[component.apiConfig.apiId] : undefined;
    
    if (componentApiData) {
      component.apiFieldMappings.forEach(mapping => {
        if (mapping && mapping.field && mapping.targetProperty && componentApiData[mapping.field] !== undefined) {
          processedProps[mapping.targetProperty] = componentApiData[mapping.field];
        }
      });
    }
  }
  
  // For text components, process content with dynamic fields
  if (type === 'text' && component.formattedContent) {
    const textProps = {
      ...processedProps,
      content: processedProps.content || component.formattedContent
    };
    
    return <Text {...textProps} />;
  }
  
  // Handle other component types
  switch (type) {
    case 'header':
      return <Header {...processedProps} />;
    case 'text':
      return <Text {...processedProps} />;
    case 'image':
      return <Image {...processedProps} />;
    case 'button':
      return <Button {...processedProps} />;
    case 'video':
      return <Video {...processedProps} />;
    case 'chart':
      return <Chart {...processedProps} data={apiData} />;
    case 'form':
      return <Form {...processedProps} />;
    case 'calendar':
      return <Calendar {...processedProps} events={apiData?.events} />;
    case 'dropdown':
      return <Dropdown {...processedProps} options={apiData?.options || processedProps.options} />;
    case 'link':
      return <Link {...processedProps} />;
    case 'multi-text':
      return <MultiText {...processedProps} />;
    case 'filter':
      return <Filter {...processedProps} options={apiData?.options || processedProps.options} />;
    case 'alert':
      return (
        <Alert 
          {...processedProps} 
          onDismiss={onAlertDismiss ? () => onAlertDismiss(component.id) : undefined}
        >
          {processedProps.content}
        </Alert>
      );
    case 'table':
      return <Table {...processedProps} data={apiData?.rows || []} columns={apiData?.columns || processedProps.columns} />;
    case 'searchbar':
      return <SearchBar {...processedProps} />;
    default:
      return <div>Unknown component type: {type}</div>;
  }
};
