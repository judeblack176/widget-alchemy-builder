
import React from 'react';
import { HelpCircle, Info, AlertTriangle, Star } from 'lucide-react';
import { Tooltip as CustomTooltip } from '../TooltipManager';

export const getTooltipContent = (tooltipId: string, customTooltips?: CustomTooltip[]) => {
  // First check if it's one of the default tooltips
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
      // If it's not a default tooltip, check the custom tooltips array
      if (customTooltips && customTooltips.length > 0) {
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
      // If not found in either defaults or customs, return null
      console.log("No tooltip found for ID:", tooltipId, "Available tooltips:", customTooltips);
      return null;
  }
};
