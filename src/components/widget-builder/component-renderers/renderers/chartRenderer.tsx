
import React, { useEffect, useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell
} from 'recharts';

const getChartColors = (colorString?: string) => {
  const defaultColors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
  if (!colorString) return defaultColors;
  
  const colors = colorString.split(',').map(c => c.trim());
  return colors.length > 0 ? colors : defaultColors;
};

const parseData = (dataString?: string) => {
  if (!dataString) return [];
  
  try {
    // Check if it's already a JSON string
    return JSON.parse(dataString);
  } catch (e) {
    // Try to parse CSV-like data
    try {
      const rows = dataString.split('\n').map(row => row.trim()).filter(Boolean);
      const headers = rows[0].split(',').map(h => h.trim());
      
      return rows.slice(1).map(row => {
        const values = row.split(',').map(v => v.trim());
        const obj: Record<string, any> = {};
        
        headers.forEach((header, index) => {
          const value = values[index];
          // Try to convert to number if possible
          obj[header] = isNaN(Number(value)) ? value : Number(value);
        });
        
        return obj;
      });
    } catch (e) {
      console.error('Failed to parse chart data:', e);
      return [];
    }
  }
};

const fetchDataFromUrl = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data from URL:', error);
    return null;
  }
};

const ChartDataLoader = ({ 
  url, 
  children, 
  onDataLoaded 
}: { 
  url: string; 
  children: (data: any[]) => React.ReactNode; 
  onDataLoaded: (data: any[]) => void;
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

export const chartRenderer = (finalProps: Record<string, any>) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const chartType = finalProps.chartType || 'bar';
  const chartHeight = finalProps.height ? Number(finalProps.height) : 300;
  const chartTitle = finalProps.title || '';
  const dataUrl = finalProps.dataUrl || '';
  const xAxisLabel = finalProps.xAxisLabel || '';
  const yAxisLabel = finalProps.yAxisLabel || '';
  
  // Process data from different sources
  let initialData: any[] = [];
  let hasData = false;
  
  if (finalProps.data) {
    // Direct data provided in props
    initialData = parseData(finalProps.data);
    hasData = initialData.length > 0;
  } else if (finalProps.staticData) {
    // Static data property
    initialData = parseData(finalProps.staticData);
    hasData = initialData.length > 0;
  } else {
    // No direct data source, will check URL
    hasData = !!dataUrl;
  }

  // If we have initial data and no URL, use it immediately
  useEffect(() => {
    if (initialData.length > 0 && !dataUrl) {
      setChartData(initialData);
    }
  }, [initialData.length, dataUrl]);
  
  const colors = getChartColors(finalProps.colors);
  const dataKey = finalProps.dataKey || 'value';
  const categoryKey = finalProps.categoryKey || 'name';

  const handleDataLoaded = (data: any[]) => {
    // Handle possible array nesting based on API response structure
    let processedData = data;

    // Check if data is nested inside a property
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      // Look for the first array property to use as data
      const arrayProperties = Object.keys(data).filter(key => Array.isArray(data[key]));
      if (arrayProperties.length > 0) {
        processedData = data[arrayProperties[0]];
      } else {
        // If no array found, wrap the object in an array
        processedData = [data];
      }
    }

    setChartData(Array.isArray(processedData) ? processedData : []);
  };
  
  const renderChartContent = (data: any[]) => {
    if (!hasData && data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50">
          <p className="text-gray-500 text-sm">No data available</p>
          <p className="text-gray-400 text-xs mt-2">Connect to a data source or provide static data</p>
        </div>
      );
    }
    
    const currentData = data.length > 0 ? data : chartData;
    
    const commonCartesianProps = {
      data: currentData,
      margin: { top: 20, right: 30, left: 20, bottom: 30 }
    };
    
    const commonAxisProps = {
      xAxisLabel,
      yAxisLabel
    };
    
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart {...commonCartesianProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={categoryKey} 
                label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
              />
              <YAxis 
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey={dataKey} fill={colors[0]}>
                {currentData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...commonCartesianProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={categoryKey} 
                label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
              />
              <YAxis 
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
              />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={dataKey} stroke={colors[0]} strokeWidth={2} dot={{ stroke: colors[0], strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...commonCartesianProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={categoryKey} 
                label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
              />
              <YAxis 
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
              />
              <Tooltip />
              <Legend />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={colors[0]} 
                fillOpacity={1} 
                fill="url(#colorGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={currentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKey}
                nameKey={categoryKey}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {currentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        
      default:
        return (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <p className="text-gray-500">Unsupported chart type: {chartType}</p>
          </div>
        );
    }
  };
  
  return (
    <div className="p-3 border rounded" style={{ backgroundColor: finalProps.backgroundColor || '#FFFFFF' }}>
      {chartTitle && <h3 className="text-center font-medium mb-3">{chartTitle}</h3>}
      <div className="bg-gray-50" style={{ height: `${chartHeight}px` }}>
        {dataUrl ? (
          <ChartDataLoader url={dataUrl} onDataLoaded={handleDataLoaded}>
            {renderChartContent}
          </ChartDataLoader>
        ) : (
          renderChartContent([])
        )}
      </div>
      {finalProps.legend && (
        <div className={`flex justify-${finalProps.legendPosition || 'center'} mt-2 gap-2 flex-wrap`}>
          {(finalProps.labels || "Item 1,Item 2,Item 3").split(',').map((label: string, index: number) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 mr-1" 
                style={{ 
                  backgroundColor: colors[index % colors.length]
                }}
              ></div>
              <span className="text-xs">{label.trim()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
