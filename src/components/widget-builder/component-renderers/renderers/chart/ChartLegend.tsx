
import React from 'react';

interface ChartLegendProps {
  labels: string;
  colors: string[];
  position: string;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({
  labels,
  colors,
  position
}) => {
  const labelItems = (labels || "Item 1,Item 2,Item 3").split(',');
  
  return (
    <div className={`flex justify-${position || 'center'} mt-2 gap-2 flex-wrap`}>
      {labelItems.map((label: string, index: number) => (
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
  );
};
