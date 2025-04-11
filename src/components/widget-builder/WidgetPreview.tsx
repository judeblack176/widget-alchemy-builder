import React, { useState, useEffect } from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import { Card } from '@/components/ui/card';
import { renderComponent } from './component-renderers';

interface WidgetPreviewProps {
  components: WidgetComponent[];
  apis: ApiConfig[];
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ components, apis }) => {
  const [apiData, setApiData] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchData = async () => {
      const apiDataResults: Record<string, any> = {};

      for (const api of apis) {
        try {
          const response = await fetch(api.endpoint, {
            method: api.method,
            headers: api.headers,
          });

          if (!response.ok) {
            console.error(`Failed to fetch API ${api.name}: ${response.status}`);
            continue;
          }

          const data = await response.json();
          apiDataResults[api.id] = data;
        } catch (error) {
          console.error(`Error fetching API ${api.name}:`, error);
        }
      }

      setApiData(apiDataResults);
    };

    if (apis.length > 0) {
      fetchData();
    }
  }, [apis]);
  
  return (
    <Card className="w-full max-w-[400px] bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 space-y-4">
        {components.map((component) => (
          <div key={component.id} className="widget-component">
            {renderComponent(component, component.apiConfig ? apiData[component.apiConfig.apiId] : undefined)}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WidgetPreview;
