
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { HelpCircle, Info, AlertTriangle, Star } from 'lucide-react';
import { Tooltip } from '@/types';

export const getNestedValue = (obj: any, path: string): any => {
  if (!obj || !path) return undefined;
  
  const parts = path.split(/\.|\[|\]/).filter(Boolean);
  let current = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    
    const index = /^\d+$/.test(part) ? parseInt(part, 10) : part;
    current = current[index];
    
    if (current && typeof current === 'object' && !Array.isArray(current) &&
        'name' in current && 'region' in current && 'country' in current && 
        'lat' in current && 'lon' in current && 'localtime' in current) {
      return `${current.name}, ${current.region}, ${current.country}`;
    }
  }
  
  return current;
};

export const getTooltipContent = (tooltipId: string, customTooltips?: Tooltip[]) => {
  switch (tooltipId) {
    case 'help':
      return (
        <div className="flex items-start gap-2">
          <HelpCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <span>Need help with this feature? Click for assistance.</span>
        </div>
      );
    case 'info':
      return (
        <div className="flex items-start gap-2">
          <Info size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
          <span>Additional information about this element.</span>
        </div>
      );
    case 'warning':
      return (
        <div className="flex items-start gap-2">
          <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <span>Important warning about this element.</span>
        </div>
      );
    case 'tip':
      return (
        <div className="flex items-start gap-2">
          <Star size={16} className="text-purple-500 mt-0.5 flex-shrink-0" />
          <span>Pro tip for using this feature effectively.</span>
        </div>
      );
    default:
      if (customTooltips) {
        const customTooltip = customTooltips.find(t => t.id === tooltipId);
        if (customTooltip) {
          return (
            <div>
              <p className="font-medium mb-1">{customTooltip.title}</p>
              <p className="text-sm">{customTooltip.content}</p>
            </div>
          );
        }
      }
      return null;
  }
};

export const wrapWithTooltip = (content: React.ReactNode, tooltipId: string, tooltips?: Tooltip[]) => {
  const tooltipContent = getTooltipContent(tooltipId, tooltips);
  
  if (!tooltipContent) {
    return content;
  }
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="tooltip-trigger w-full">
          {content}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-3">
        {tooltipContent}
      </HoverCardContent>
    </HoverCard>
  );
};
