
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown, Trash2, HelpCircle, Info, AlertTriangle, Star } from 'lucide-react';
import { Tooltip as CustomTooltip } from "../TooltipManager";
import TooltipSelector from "./TooltipSelector";

interface ComponentHeaderProps {
  title: string;
  tooltipId?: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onApplyTooltip?: (tooltipId: string) => void;
  onRemoveComponent?: () => void;
  customTooltips?: CustomTooltip[];
  disableRemove?: boolean;
}

const ComponentHeader: React.FC<ComponentHeaderProps> = ({
  title,
  tooltipId,
  isExpanded,
  onToggleExpand,
  onApplyTooltip,
  onRemoveComponent,
  customTooltips = [],
  disableRemove = false
}) => {
  const validCustomTooltips = customTooltips.filter(tooltip => tooltip && tooltip.id);

  const getTooltipIcon = (tooltipId: string) => {
    switch(tooltipId) {
      case "help": return <HelpCircle size={16} className="text-blue-500" />;
      case "info": return <Info size={16} className="text-green-500" />;
      case "warning": return <AlertTriangle size={16} className="text-amber-500" />;
      case "tip": return <Star size={16} className="text-purple-500" />;
      default: 
        return validCustomTooltips.some(t => t.id === tooltipId) ? 
          <Info size={16} className="text-indigo-500" /> : 
          null;
    }
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        <span className="mr-2 text-lg font-semibold">{title}</span>
        
        {tooltipId && tooltipId !== "none" && (
          <div className="ml-1">
            {getTooltipIcon(tooltipId)}
          </div>
        )}
      </div>
      
      <div className="flex space-x-2">
        {onApplyTooltip && (
          <TooltipSelector 
            tooltipId={tooltipId} 
            onApplyTooltip={onApplyTooltip} 
            customTooltips={customTooltips} 
          />
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleExpand}
          className="text-gray-500"
        >
          {isExpanded ? (
            <><ChevronUp size={16} /> Collapse</>
          ) : (
            <><ChevronDown size={16} /> Expand</>
          )}
        </Button>
        
        {onRemoveComponent && !disableRemove && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRemoveComponent} 
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ComponentHeader;
