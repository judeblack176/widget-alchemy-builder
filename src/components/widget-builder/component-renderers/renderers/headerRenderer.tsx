
import React from 'react';
import { getIconByName } from '../iconUtils';

export const headerRenderer = (finalProps: Record<string, any>) => {
  return (
    <div 
      className="w-full p-3 sticky top-0 z-10"
      style={{
        backgroundColor: finalProps.backgroundColor || '#3B82F6',
        color: finalProps.textColor || '#FFFFFF',
        marginTop: 0,
        marginLeft: -16,
        marginRight: -16,
        width: 'calc(100% + 32px)',
      }}
    >
      <div className="flex items-center text-left pl-8">
        {getIconByName(finalProps.icon || 'BookOpen')}
        <h2 
          className="text-left"
          style={{
            fontFamily: finalProps.fontFamily || 'system-ui',
            fontWeight: finalProps.bold ? 'bold' : 'normal',
            fontStyle: finalProps.italic ? 'italic' : 'normal'
          }}
        >
          {finalProps.name || finalProps.title || "Header"}
        </h2>
      </div>
    </div>
  );
};
