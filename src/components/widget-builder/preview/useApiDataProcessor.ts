
import { useState, useEffect } from 'react';
import { ApiConfig, WidgetComponent, ContentFieldConfig } from '@/types/widget-types';
import { useToast } from '@/hooks/use-toast';

export const useApiDataProcessor = (components: WidgetComponent[], apis: ApiConfig[]) => {
  const [apiData, setApiData] = useState<Record<string, any>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
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

      setApiData(apiDataResults);
    };

    if (apis.length > 0) {
      fetchData();
    }
  }, [apis]);

  const processComponentData = (component: WidgetComponent) => {
    if (!component.apiConfig) return undefined;
    
    const apiId = component.apiConfig.apiId;
    const apiResult = apiData[apiId];
    
    if (!apiResult) {
      return undefined;
    }
    
    if (component.apiConfig.contentConfig) {
      const processedData = { ...apiResult };
      
      Object.entries(component.apiConfig.contentConfig).forEach(([contentKey, config]) => {
        const typedConfig = config as ContentFieldConfig;
        if (typedConfig.field && apiResult[typedConfig.field] !== undefined) {
          processedData[`formatted_${contentKey}`] = {
            value: apiResult[typedConfig.field],
            customText: typedConfig.customText || '',
            fontFamily: typedConfig.fontFamily || 'system-ui',
            fontSize: typedConfig.fontSize || '16px',
            alignment: typedConfig.alignment || 'left'
          };
        } else if (typedConfig.customText) {
          processedData[`formatted_${contentKey}`] = {
            value: '',
            customText: typedConfig.customText,
            fontFamily: typedConfig.fontFamily || 'system-ui',
            fontSize: typedConfig.fontSize || '16px',
            alignment: typedConfig.alignment || 'left'
          };
        }
      });
      
      return processedData;
    }
    
    if (component.apiConfig.multiMapping) {
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
    }
    
    return apiResult;
  };

  return { apiData, processComponentData };
};
