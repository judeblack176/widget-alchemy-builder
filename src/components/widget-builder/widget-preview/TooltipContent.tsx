
import React from 'react';
import { HelpCircle, AlertCircle } from 'lucide-react';

interface TooltipContentProps {
  tooltipId: string;
}

const TooltipContent: React.FC<TooltipContentProps> = ({ tooltipId }) => {
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
          <HelpCircle size={16} className="text-green-500 mt-0.5" />
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
          <HelpCircle size={16} className="text-purple-500 mt-0.5" />
          <span>Pro Tip: This feature can help you save time</span>
        </div>
      );
    default:
      return (
        <div>Information</div>
      );
  }
};

export default TooltipContent;
