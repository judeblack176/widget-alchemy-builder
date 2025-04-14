
import React from 'react';
import { 
  BarChartComponent,
  LineChartComponent,
  AreaChartComponent,
  PieChartComponent
} from './chartTypes';

interface ChartContentProps {
  data: any[];
  chartType: string;
  dataKey: string;
  categoryKey: string;
  colors: string[];
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const ChartContent: React.FC<ChartContentProps> = ({
  data,
  chartType,
  dataKey,
  categoryKey,
  colors,
  xAxisLabel,
  yAxisLabel
}) => {
  if (data.length === 0) {
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
        <BarChartComponent 
          data={data}
          colors={colors}
          dataKey={dataKey}
          categoryKey={categoryKey}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
        />
      );
      
    case 'line':
      return (
        <LineChartComponent 
          data={data}
          colors={colors}
          dataKey={dataKey}
          categoryKey={categoryKey}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
        />
      );
      
    case 'area':
      return (
        <AreaChartComponent 
          data={data}
          colors={colors}
          dataKey={dataKey}
          categoryKey={categoryKey}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
        />
      );
      
    case 'pie':
      return (
        <PieChartComponent 
          data={data}
          colors={colors}
          dataKey={dataKey}
          categoryKey={categoryKey}
        />
      );
      
    default:
      return (
        <div className="flex items-center justify-center h-full bg-gray-50">
          <p className="text-gray-500">Unsupported chart type: {chartType}</p>
        </div>
      );
  }
};
