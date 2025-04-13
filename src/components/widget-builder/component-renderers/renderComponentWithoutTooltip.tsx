
import React from 'react';
import { WidgetComponent } from '@/types/widget-types';
import { processApiData } from './dataUtils';
import { getRendererForType, renderErrorComponent } from './rendererFactory';
import { cleanHtmlContent } from './utils/contentUtils';

export { cleanHtmlContent } from './utils/contentUtils';

export const renderComponentWithoutTooltip = (component: WidgetComponent, apiData?: any, onDismiss?: (id: string) => void) => {
  const { props, type, id, formattedContent } = component;
  
  if (!type) {
    console.error('Component has no type defined:', component);
    return renderErrorComponent('Invalid component: missing type property');
  }
  
  // Get the renderer for this component type
  const renderer = getRendererForType(type);
  
  if (!renderer) {
    console.error(`Unsupported component type: ${type}`);
    return renderErrorComponent(`Unsupported component type: ${type}`);
  }
  
  // Process component props with API data and content fields
  const processedProps = processApiData(component, apiData);
  
  // For display in the component list, we clean the HTML content
  const originalContent = formattedContent || '';
  const displayContent = originalContent ? cleanHtmlContent(originalContent) : '';
  
  // For rendering, we use the processed content with replaced field values
  const finalProps = {
    ...processedProps,
    displayContent // Add clean content for display purposes
  };
  
  // Render the component using the appropriate renderer
  return renderer(finalProps, id, onDismiss);
};
