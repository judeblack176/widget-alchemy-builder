
import React from 'react';
import { getIconByName } from '../iconUtils';
import parse from 'html-react-parser';

export const headerRenderer = (finalProps: Record<string, any>) => {
  // Process the header content - use either formattedContent or name
  const headerContent = finalProps.formattedContent || finalProps.name || "Header";
  
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
      <div className="flex items-center text-left pl-4">
        {getIconByName(finalProps.icon || 'BookOpen')}
        <div className="ml-2 overflow-hidden text-ellipsis whitespace-nowrap">
          {headerContent && typeof headerContent === 'string' && headerContent.includes('<span') 
            ? parse(headerContent) 
            : <h2 className="text-left text-ellipsis overflow-hidden whitespace-nowrap">{headerContent}</h2>}
        </div>
      </div>
    </div>
  );
};
