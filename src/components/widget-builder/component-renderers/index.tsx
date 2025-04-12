import React from 'react';
import { WidgetComponent, Tooltip } from '@/types';
import { getNestedValue, wrapWithTooltip } from './utils';
import HeaderRenderer from './HeaderRenderer';
import TextRenderer from './TextRenderer';
import ImageRenderer from './ImageRenderer';
import ButtonRenderer from './ButtonRenderer';
import VideoRenderer from './VideoRenderer';
import ChartRenderer from './ChartRenderer';
import FormRenderer from './FormRenderer';
import CalendarRenderer from './CalendarRenderer';
import DropdownRenderer from './DropdownRenderer';
import LinkRenderer from './LinkRenderer';
import MultiTextRenderer from './MultiTextRenderer';
import FilterRenderer from './FilterRenderer';
import AlertRenderer from './AlertRenderer';
import TableRenderer from './TableRenderer';
import SearchbarRenderer from './SearchbarRenderer';
import InvalidComponentRenderer from './InvalidComponentRenderer';

export const renderComponent = (
  component: WidgetComponent, 
  apiData?: any, 
  onDismiss?: (id: string) => void,
  tooltips?: Tooltip[]
) => {
  const { props, type, id, tooltipId } = component;
  
  // Process props with API data if available
  let finalProps = { ...props };
  if (component.apiConfig && apiData) {
    const { dataMapping } = component.apiConfig;
    
    Object.entries(dataMapping).forEach(([propKey, apiField]) => {
      const value = getNestedValue(apiData, apiField);
      if (value !== undefined) {
        if (typeof value === 'object' && value !== null) {
          if (Array.isArray(value)) {
            finalProps[propKey] = value.join(', ');
          } else {
            finalProps[propKey] = JSON.stringify(value);
          }
        } else {
          finalProps[propKey] = value;
        }
      }
    });
  }
  
  // Render the appropriate component based on type
  const renderComponentWithoutTooltip = () => {
    if (!type) {
      console.error('Component has no type defined:', component);
      return <InvalidComponentRenderer component={component} />;
    }
    
    switch (type) {
      case 'header':
        return <HeaderRenderer component={component} finalProps={finalProps} />;
      
      case 'text':
        return <TextRenderer component={component} finalProps={finalProps} />;
      
      case 'image':
        return <ImageRenderer component={component} finalProps={finalProps} />;
      
      case 'button':
        return <ButtonRenderer component={component} finalProps={finalProps} />;
      
      case 'video':
        return <VideoRenderer component={component} finalProps={finalProps} />;
      
      case 'chart':
        return <ChartRenderer component={component} finalProps={finalProps} />;
      
      case 'form':
        return <FormRenderer component={component} finalProps={finalProps} />;
      
      case 'calendar':
        return <CalendarRenderer component={component} finalProps={finalProps} />;
      
      case 'dropdown':
        return <DropdownRenderer component={component} finalProps={finalProps} />;
      
      case 'link':
        return <LinkRenderer component={component} finalProps={finalProps} />;
      
      case 'multi-text':
        return <MultiTextRenderer component={component} finalProps={finalProps} />;
      
      case 'filter':
        return <FilterRenderer component={component} finalProps={finalProps} />;
      
      case 'alert':
        return <AlertRenderer 
          component={component} 
          finalProps={finalProps} 
          onDismiss={onDismiss} 
        />;
      
      case 'table':
        return <TableRenderer component={component} finalProps={finalProps} />;
      
      case 'searchbar':
        return <SearchbarRenderer component={component} finalProps={finalProps} />;
      
      default:
        console.error(`Unsupported component type: ${type}`);
        return <InvalidComponentRenderer component={component} />;
    }
  };
  
  // If no tooltip is needed, just render the component
  if (!tooltipId) {
    return renderComponentWithoutTooltip();
  }
  
  // Otherwise, wrap it with a tooltip
  return wrapWithTooltip(renderComponentWithoutTooltip(), tooltipId, tooltips);
};
