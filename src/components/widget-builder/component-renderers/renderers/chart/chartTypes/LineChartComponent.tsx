
import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface LineChartComponentProps {
  data: any[];
  colors: string[];
  dataKey: string;
  categoryKey: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const LineChartComponent: React.FC<LineChartComponentProps> = ({
  data,
  colors,
  dataKey,
  categoryKey,
  xAxisLabel,
  yAxisLabel
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
      >
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
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke={colors[0]} 
          strokeWidth={2} 
          dot={{ stroke: colors[0], strokeWidth: 2 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
