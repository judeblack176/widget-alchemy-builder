import React from 'react';
import { WidgetComponent } from '@/types/widget-types';
import TooltipComponent from './TooltipComponent';
import { Button } from '@/components/ui/button';

export const renderComponent = (component: WidgetComponent, apiData?: any) => {
  const { props, type } = component;
  
  let finalProps = { ...props };
  if (component.apiConfig && apiData) {
    const { dataMapping } = component.apiConfig;
    
    Object.entries(dataMapping).forEach(([propKey, apiField]) => {
      const value = getNestedValue(apiData, apiField);
      if (value !== undefined) {
        finalProps[propKey] = value;
      }
    });
  }
  
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

const renderComponentWithoutTooltip = (component: WidgetComponent, apiData?: any) => {
  const { props, type } = component;
  
  let finalProps = { ...props };
  if (component.apiConfig && apiData) {
    const { dataMapping } = component.apiConfig;
    
    Object.entries(dataMapping).forEach(([propKey, apiField]) => {
      const value = getNestedValue(apiData, apiField);
      if (value !== undefined) {
        finalProps[propKey] = value;
      }
    });
  }
  
  switch (type) {
    case 'button':
      return (
        <Button
          variant={finalProps.variant || "default"}
          size={finalProps.size || "default"}
          className={finalProps.className}
          onClick={() => console.log('Button clicked', finalProps.label)}
        >
          {finalProps.label || "Button"}
        </Button>
      );
      
    case 'tooltip':
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

const getNestedValue = (obj: any, path: string): any => {
  if (!obj || !path) return undefined;
  
  const parts = path.split(/\.|\[|\]/).filter(Boolean);
  let current = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    
    const index = /^\d+$/.test(part) ? parseInt(part, 10) : part;
    current = current[index];
  }
  
  return current;
};
