
import { useState, useEffect } from 'react';
import { ApiConfig } from '@/types/widget-types';
import { useToast } from '@/hooks/use-toast';

interface ApiDataFetcherProps {
  apis: ApiConfig[];
  onDataFetched: (apiData: Record<string, any>) => void;
}

export const useApiDataFetcher = (apis: ApiConfig[]) => {
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

  return apiData;
};

const ApiDataFetcher: React.FC<ApiDataFetcherProps> = ({ apis, onDataFetched }) => {
  const apiData = useApiDataFetcher(apis);
  
  useEffect(() => {
    onDataFetched(apiData);
  }, [apiData, onDataFetched]);
  
  return null;
};

export default ApiDataFetcher;
