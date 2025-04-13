
import React from 'react';

export const chartRenderer = (finalProps: Record<string, any>) => {
  const chartTypeLabel = finalProps.chartType || 'bar';
  const hasData = finalProps.staticData || (finalProps.dataUrl && finalProps.dataSource !== 'static');
  
  return (
    <div className="p-3 border rounded" style={{ backgroundColor: finalProps.backgroundColor || '#FFFFFF' }}>
      {finalProps.title && <h3 className="text-center font-medium mb-3">{finalProps.title}</h3>}
      <div className="aspect-video bg-gray-100 flex flex-col items-center justify-center" style={{ height: finalProps.height ? `${finalProps.height}px` : '300px' }}>
        {hasData ? (
          <div className="text-center">
            <p className="text-gray-700 font-medium">{chartTypeLabel.charAt(0).toUpperCase() + chartTypeLabel.slice(1)} Chart</p>
            <p className="text-gray-500 text-sm mt-1">
              {finalProps.dataSource === 'api' ? 'Data from API' : 
               finalProps.dataSource === 'url' ? 'Data from URL' : 
               'Static data'}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-500 text-sm">No data configured</p>
            <p className="text-gray-400 text-xs mt-2">Connect to a data source or provide static data</p>
          </div>
        )}
      </div>
      {finalProps.legend && (
        <div className={`flex justify-${finalProps.legendPosition || 'bottom'} mt-2 gap-2 flex-wrap`}>
          {(finalProps.labels || "Item 1,Item 2,Item 3").split(',').map((label: string, index: number) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 mr-1" 
                style={{ 
                  backgroundColor: (finalProps.colors || "#3B82F6,#EF4444,#10B981,#F59E0B").split(',')[index % 4] 
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
