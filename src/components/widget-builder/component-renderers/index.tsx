
import React from 'react';
import { WidgetComponent } from '@/types/widget-types';
import TooltipComponent from './TooltipComponent';

// Import other component renderers as needed

export const renderComponent = (component: WidgetComponent, apiData?: any) => {
  const { props, type } = component;
  
  // Map API data to component props if apiConfig is present
  let finalProps = { ...props };
  if (component.apiConfig && apiData) {
    const { dataMapping } = component.apiConfig;
    
    // Map each API field to component prop
    Object.entries(dataMapping).forEach(([propKey, apiField]) => {
      // Use lodash-style dot notation to access nested properties
      const value = getNestedValue(apiData, apiField);
      if (value !== undefined) {
        finalProps[propKey] = value;
      }
    });
  }
  
  // Check if we need to wrap this component in a tooltip
  if (finalProps.tooltip && type !== 'tooltip') {
    const tooltipProps = finalProps.tooltip;
    const componentWithoutTooltip = {
      ...component,
      props: { ...finalProps, tooltip: undefined }
    };
    
    return (
      <TooltipComponent
        content={tooltipProps.content || "Tooltip content"}
        placement={tooltipProps.placement}
        backgroundColor={tooltipProps.backgroundColor}
        textColor={tooltipProps.textColor}
        showArrow={tooltipProps.showArrow}
        triggerStyle="custom"
      >
        {renderComponentWithoutTooltip(componentWithoutTooltip, apiData)}
      </TooltipComponent>
    );
  }
  
  return renderComponentWithoutTooltip(component, apiData);
};

// Helper function to render component without tooltip wrapping logic
const renderComponentWithoutTooltip = (component: WidgetComponent, apiData?: any) => {
  const { props, type } = component;
  
  // Map API data to component props if apiConfig is present
  let finalProps = { ...props };
  if (component.apiConfig && apiData) {
    const { dataMapping } = component.apiConfig;
    
    // Map each API field to component prop
    Object.entries(dataMapping).forEach(([propKey, apiField]) => {
      // Use lodash-style dot notation to access nested properties
      const value = getNestedValue(apiData, apiField);
      if (value !== undefined) {
        finalProps[propKey] = value;
      }
    });
  }
  
  switch (type) {
    // ... Add other component type cases here
    
    case 'tooltip':
      // Pass any children component if specified in the tooltip configuration
      const tooltipChildren = finalProps.children ? 
        renderComponent(finalProps.children, apiData) : null;
      
      return (
        <TooltipComponent
          triggerText={finalProps.triggerText || "Hover me"}
          content={finalProps.content || "Tooltip content"}
          placement={finalProps.placement}
          backgroundColor={finalProps.backgroundColor}
          textColor={finalProps.textColor}
          showArrow={finalProps.showArrow}
          triggerStyle={finalProps.triggerStyle}
        >
          {tooltipChildren}
        </TooltipComponent>
      );
      
    default:
      return <div>Unsupported component type: {type}</div>;
  }
};

// Helper function to get nested values using dot notation
const getNestedValue = (obj: any, path: string): any => {
  if (!obj || !path) return undefined;
  
  // Handle array notation like items[0].name
  const parts = path.split(/\.|\[|\]/).filter(Boolean);
  let current = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    
    // If part is a number (from array notation), parse it
    const index = /^\d+$/.test(part) ? parseInt(part, 10) : part;
    current = current[index];
  }
  
  return current;
};
