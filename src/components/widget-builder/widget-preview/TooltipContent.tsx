
import React from 'react';
import { HelpCircle, AlertCircle, Info, Star } from 'lucide-react';
import { Tooltip } from '../TooltipManager';

interface TooltipContentProps {
  tooltipId: string;
  customTooltips?: Tooltip[];
}

const TooltipContent: React.FC<TooltipContentProps> = ({ tooltipId, customTooltips = [] }) => {
  // First check standard tooltips
  switch (tooltipId) {
    case "help":
      return (
        <div className="flex items-start gap-2">
          <HelpCircle size={16} className="text-blue-500 mt-0.5" />
          <span>Help information about this feature</span>
        </div>
      );
    case "info":
      return (
        <div className="flex items-start gap-2">
          <Info size={16} className="text-green-500 mt-0.5" />
          <span>Additional information about this component</span>
        </div>
      );
    case "warning":
      return (
        <div className="flex items-start gap-2">
          <AlertCircle size={16} className="text-amber-500 mt-0.5" />
          <span>Warning: Please review this information carefully</span>
        </div>
      );
    case "tip":
      return (
        <div className="flex items-start gap-2">
          <Star size={16} className="text-purple-500 mt-0.5" />
          <span>Pro Tip: This feature can help you save time</span>
        </div>
      );
    default:
      // Check if it's a custom tooltip
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
      
      // Default fallback
      return (
        <div>Information</div>
      );
  }
};

export default TooltipContent;
