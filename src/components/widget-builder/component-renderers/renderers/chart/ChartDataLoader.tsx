
import React, { useState, useEffect } from 'react';
import { fetchDataFromUrl } from './chartUtils';

interface ChartDataLoaderProps {
  url: string;
  children: (data: any[]) => React.ReactNode;
  onDataLoaded: (data: any[]) => void;
}

export const ChartDataLoader: React.FC<ChartDataLoaderProps> = ({ 
  url, 
  children, 
  onDataLoaded 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedData = await fetchDataFromUrl(url);
        if (fetchedData) {
          onDataLoaded(fetchedData);
        } else {
          setError('Failed to load data');
        }
      } catch (err) {
        setError('Error loading chart data');
        console.error('Chart data loading error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [url, onDataLoaded]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-gray-500">Loading chart data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return <>{children([])}</>;
};
