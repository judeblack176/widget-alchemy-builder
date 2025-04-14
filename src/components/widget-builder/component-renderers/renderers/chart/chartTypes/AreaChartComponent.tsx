
import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface AreaChartComponentProps {
  data: any[];
  colors: string[];
  dataKey: string;
  categoryKey: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const AreaChartComponent: React.FC<AreaChartComponentProps> = ({
  data,
  colors,
  dataKey,
  categoryKey,
  xAxisLabel,
  yAxisLabel
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
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
};
