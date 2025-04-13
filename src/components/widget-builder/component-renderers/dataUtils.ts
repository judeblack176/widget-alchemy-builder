
import { WidgetComponent, ContentField } from '@/types/component-types';

export const processApiData = (component: WidgetComponent, apiData?: any) => {
  let finalProps = { ...component.props };
  
  // Process API data mapping if available
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
  
  // Process formatted content with content fields
  if (component.formattedContent && component.contentFields && component.contentFields.length > 0 && apiData) {
    let processedContent = component.formattedContent;
    
    component.contentFields.forEach((field: ContentField) => {
      const value = getNestedValue(apiData, field.apiField);
      if (value !== undefined) {
        const placeholder = `{{${field.label}}}`;
        let displayValue = value;
        
        if (typeof value === 'object' && value !== null) {
          if (Array.isArray(value)) {
            displayValue = value.join(', ');
          } else {
            displayValue = JSON.stringify(value);
          }
        }
        
        // Replace all occurrences of the placeholder
        processedContent = processedContent.replace(new RegExp(placeholder, 'g'), String(displayValue));
      }
    });
    
    // Update both formattedContent and content props for consistent rendering
    finalProps.formattedContent = processedContent;
    finalProps.content = processedContent;
  }
  
  return finalProps;
};

export const getNestedValue = (obj: any, path: string): any => {
  if (!obj || !path) return undefined;
  
  const parts = path.split(/\.|\[|\]/).filter(Boolean);
  let current = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    
    const index = /^\d+$/.test(part) ? parseInt(part, 10) : part;
    current = current[index];
    
    if (current && typeof current === 'object' && !Array.isArray(current) &&
        'name' in current && 'region' in current && 'country' in current && 
        'lat' in current && 'lon' in current && 'localtime' in current) {
      return `${current.name}, ${current.region}, ${current.country}`;
    }
  }
  
  return current;
};
