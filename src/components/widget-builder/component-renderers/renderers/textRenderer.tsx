
import React from 'react';

export const textRenderer = (finalProps: Record<string, any>) => {
  return (
    <div 
      className="p-3 rounded"
      style={{
        backgroundColor: finalProps.backgroundColor || 'transparent',
        color: finalProps.color || '#333333',
      }}
    >
      <p 
        style={{
          fontSize: finalProps.size === 'small' ? '0.875rem' : finalProps.size === 'large' ? '1.25rem' : '1rem',
          fontFamily: finalProps.fontFamily || 'system-ui',
          fontWeight: finalProps.bold ? 'bold' : 'normal',
          fontStyle: finalProps.italic ? 'italic' : 'normal'
        }}
      >
        {finalProps.content || "Text content"}
      </p>
      {finalProps.apiData && (
        <div className="mt-1 text-xs">
          <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">API Connected</span>
        </div>
      )}
    </div>
  );
};
