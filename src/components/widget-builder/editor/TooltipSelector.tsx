
import React from "react";
import { Tooltip as CustomTooltip } from "../TooltipManager";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle, Info, AlertTriangle, Star } from 'lucide-react';

interface TooltipSelectorProps {
  tooltipId?: string;
  onApplyTooltip?: (tooltipId: string) => void;
  customTooltips?: CustomTooltip[];
}

const TooltipSelector: React.FC<TooltipSelectorProps> = ({
  tooltipId,
  onApplyTooltip,
  customTooltips = []
}) => {
  if (!onApplyTooltip) return null;

  const defaultTooltipOptions = [
    { id: "none", label: "No Tooltip" },
    { id: "help", label: "Help Info" },
    { id: "info", label: "Additional Info" },
    { id: "warning", label: "Warning" },
    { id: "tip", label: "Pro Tip" }
  ];

  const validCustomTooltips = customTooltips.filter(tooltip => tooltip && tooltip.id);

  const tooltipOptions = [
    ...defaultTooltipOptions,
    ...validCustomTooltips.map(tooltip => ({
      id: tooltip.id,
      label: tooltip.title,
      content: tooltip.content,
      tags: tooltip.tags
    }))
  ];

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
    <Select 
      value={tooltipId || "none"} 
      onValueChange={(value) => {
        if (value === "none") {
          onApplyTooltip("");
        } else {
          onApplyTooltip(value);
        }
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a tooltip" />
      </SelectTrigger>
      <SelectContent>
        {tooltipOptions.map((option) => (
          <SelectItem key={option.id} value={option.id} className="flex items-center gap-2">
            {option.id !== "none" && getTooltipIcon(option.id)}
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TooltipSelector;
