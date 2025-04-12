
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
  
  // For text components, process content with dynamic fields
  if (type === 'text' && component.formattedContent) {
    const textProps = {
      ...props,
      content: props.content || component.formattedContent
    };
    
    return <Text {...textProps} />;
  }
  
  // Handle other component types...
  switch (type) {
    case 'header':
      return <Header {...props} />;
    case 'text':
      return <Text {...props} />;
    case 'image':
      return <Image {...props} />;
    case 'button':
      return <Button {...props} />;
    case 'video':
      return <Video {...props} />;
    case 'chart':
      return <Chart {...props} data={apiData} />;
    case 'form':
      return <Form {...props} />;
    case 'calendar':
      return <Calendar {...props} events={apiData?.events} />;
    case 'dropdown':
      return <Dropdown {...props} options={apiData?.options || props.options} />;
    case 'link':
      return <Link {...props} />;
    case 'multi-text':
      return <MultiText {...props} />;
    case 'filter':
      return <Filter {...props} options={apiData?.options || props.options} />;
    case 'alert':
      return <Alert {...props} onDismiss={onAlertDismiss ? () => onAlertDismiss(component.id) : undefined} />;
    case 'table':
      return <Table {...props} data={apiData?.rows || []} columns={apiData?.columns || props.columns} />;
    case 'searchbar':
      return <SearchBar {...props} />;
    default:
      return <div>Unknown component type: {type}</div>;
  }
};
