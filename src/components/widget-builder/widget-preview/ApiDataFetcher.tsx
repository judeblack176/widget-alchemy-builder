
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
          
          // First try to use sample response if available
          if (api.sampleResponse) {
            try {
              const sampleData = JSON.parse(api.sampleResponse);
              apiDataResults[api.id] = sampleData;
              console.log(`Using sample response for API ${api.name}`);
              continue;
            } catch (error) {
              console.error(`Failed to parse sample response for API ${api.name}:`, error);
            }
          }
          
          // If no sample response or parsing failed, try to fetch data
          console.log(`Fetching data for API ${api.name} from ${api.endpoint}`);
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
          console.log(`Received data for API ${api.name}:`, data);
          apiDataResults[api.id] = data;
        } catch (error) {
          console.error(`Error fetching API ${api.name}:`, error);
          apiDataResults[api.id] = {};
        }
      }

      console.log('Final API data:', apiDataResults);
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
