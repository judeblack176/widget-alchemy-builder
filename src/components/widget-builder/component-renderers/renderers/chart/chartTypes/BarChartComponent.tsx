
import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell
} from 'recharts';

interface BarChartComponentProps {
  data: any[];
  colors: string[];
  dataKey: string;
  categoryKey: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  colors,
  dataKey,
  categoryKey,
  xAxisLabel,
  yAxisLabel
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
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
        <Bar dataKey={dataKey} fill={colors[0]}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
