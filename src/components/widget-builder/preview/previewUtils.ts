
import { WidgetComponent, ApiConfig } from '@/types';

export interface ContentDetails {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const getDisplayComponents = (components: WidgetComponent[]) => {
  // Get only the first header component to prevent duplicates
  const headerComponent = components.find(c => c.type === 'header');
  
  // Calculate component limits
  const alertComponents = components.filter(c => c.type === 'alert');
  const hasAlertComponent = alertComponents.length > 0;
  const MAX_COMPONENTS = hasAlertComponent ? 7 : 6;
  
  const nonHeaderNonAlertComponents = components.filter(c => c.type !== 'header' && c.type !== 'alert');
  const regularComponentsToDisplay = nonHeaderNonAlertComponents.slice(0, MAX_COMPONENTS);
  
  // Make sure we only have one header in the display components
  const displayComponents = [
    ...(headerComponent ? [headerComponent] : []),
    ...alertComponents,
    ...regularComponentsToDisplay
  ];
  
  const hasExcessComponents = nonHeaderNonAlertComponents.length > MAX_COMPONENTS;
  
  return {
    headerComponent,
    displayComponents,
    nonHeaderNonAlertComponents,
    hasExcessComponents,
    MAX_COMPONENTS
  };
};

export const processComponentData = (
  component: WidgetComponent, 
  apiData: Record<string, any>
) => {
  if (!component.apiConfig) return undefined;
  
  const apiId = component.apiConfig.apiId;
  const apiResult = apiData[apiId];
  
  if (!apiResult || !component.apiConfig.multiMapping) {
    return apiResult;
  }
  
  const processedData = { ...apiResult };
  
  Object.entries(component.apiConfig.multiMapping).forEach(([propKey, fields]) => {
    if (fields && fields.length > 0) {
      const fieldValues = fields.map(field => {
        return apiResult[field];
      }).filter(val => val !== undefined);
      
      if (fieldValues.length > 0) {
        processedData[`multi_${propKey}`] = fieldValues;
      }
    }
  });
  
  return processedData;
};

export const fetchApiData = async (apis: ApiConfig[]) => {
  const apiDataResults: Record<string, any> = {};

  for (const api of apis) {
    try {
      if (!api.endpoint) {
        console.log(`No endpoint defined for API ${api.name}`);
        continue;
      }
      
      if (api.sampleResponse) {
        try {
          apiDataResults[api.id] = JSON.parse(api.sampleResponse);
          continue;
        } catch (error) {
          console.error(`Failed to parse sample response for API ${api.name}:`, error);
        }
      }
      
      const response = await fetch(api.endpoint, {
        method: api.method,
        headers: api.headers || {},
      });

      if (!response.ok) {
        console.error(`Failed to fetch API ${api.name}: ${response.status}`);
        apiDataResults[api.id] = {};
        continue;
      }

      const data = await response.json();
      apiDataResults[api.id] = data;
    } catch (error) {
      console.error(`Error fetching API ${api.name}:`, error);
      apiDataResults[api.id] = {};
    }
  }

  return apiDataResults;
};
