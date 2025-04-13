
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { getLinkIcon } from '../iconUtils';

export const linkRenderer = (finalProps: Record<string, any>) => {
  const openInNewTab = finalProps.openInNewTab === true;
  const displayType = finalProps.displayType || 'text';
  const icon = displayType !== 'text' ? getLinkIcon(finalProps.icon || 'LinkIcon') : null;
  
  return (
    <div className="inline-block w-1/2 pr-1 pb-2">
      <a
        href={finalProps.url || "#"}
        target={openInNewTab ? "_blank" : "_self"}
        rel={openInNewTab ? "noopener noreferrer" : ""}
        className={`w-full flex justify-center ${finalProps.style === 'button' ? 'px-2 py-1 rounded hover:bg-opacity-90 flex items-center text-xs' : 
                  finalProps.style === 'underlined' ? 'underline hover:text-opacity-80 flex items-center text-xs' : 
                  'hover:text-opacity-80 flex items-center text-xs'}`}
        style={{
          backgroundColor: finalProps.style === 'button' ? (finalProps.backgroundColor || '#3B82F6') : 'transparent',
          color: finalProps.color || (finalProps.style === 'button' ? '#FFFFFF' : '#3B82F6')
        }}
      >
        {(displayType === 'icon' || displayType === 'both') && icon}
        {(displayType === 'text' || displayType === 'both') && (finalProps.text || "Link")}
        {openInNewTab && displayType === 'text' && <ExternalLink size={12} className="ml-1" />}
      </a>
    </div>
  );
};
