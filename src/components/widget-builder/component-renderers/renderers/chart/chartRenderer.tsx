
import React, { useState, useEffect } from 'react';
import { ChartDataLoader } from './ChartDataLoader';
import { ChartContent } from './ChartContent';
import { ChartLegend } from './ChartLegend';
import { getChartColors, parseData } from './chartUtils';

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
    const currentData = data.length > 0 ? data : chartData;
    
    return (
      <ChartContent 
        data={currentData}
        chartType={chartType}
        dataKey={dataKey}
        categoryKey={categoryKey}
        colors={colors}
        xAxisLabel={xAxisLabel}
        yAxisLabel={yAxisLabel}
      />
    );
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
        <ChartLegend 
          labels={finalProps.labels || "Item 1,Item 2,Item 3"}
          colors={colors}
          position={finalProps.legendPosition || 'center'}
        />
      )}
    </div>
  );
};
