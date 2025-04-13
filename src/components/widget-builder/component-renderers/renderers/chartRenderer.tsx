
import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  LineChart,
  Line,
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

export const chartRenderer = (finalProps: Record<string, any>) => {
  const chartType = finalProps.chartType || 'bar';
  const chartHeight = finalProps.height ? Number(finalProps.height) : 300;
  const chartTitle = finalProps.title || '';
  
  // Process data from different sources
  let chartData = [];
  let hasData = false;
  
  if (finalProps.data) {
    // Direct data provided in props
    chartData = parseData(finalProps.data);
    hasData = chartData.length > 0;
  } else if (finalProps.staticData) {
    // Static data property
    chartData = parseData(finalProps.staticData);
    hasData = chartData.length > 0;
  } else {
    // No data source
    hasData = false;
  }
  
  const colors = getChartColors(finalProps.colors);
  const dataKey = finalProps.dataKey || 'value';
  const categoryKey = finalProps.categoryKey || 'name';
  
  const renderChart = () => {
    if (!hasData) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50">
          <p className="text-gray-500 text-sm">No data available</p>
          <p className="text-gray-400 text-xs mt-2">Connect to a data source or provide static data</p>
        </div>
      );
    }
    
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={categoryKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={dataKey} fill={colors[0]} />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={categoryKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={dataKey} stroke={colors[0]} />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKey}
                nameKey={categoryKey}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
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
        {renderChart()}
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
