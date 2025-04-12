
import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle, Info, AlertTriangle, Star } from "lucide-react";
import { Tooltip } from "../TooltipManager";

interface TooltipSelectorProps {
  component: WidgetComponent;
  customTooltips?: Tooltip[];
  onApplyTooltip: (tooltipId: string) => void;
}

const TooltipSelector: React.FC<TooltipSelectorProps> = ({
  component,
  customTooltips = [],
  onApplyTooltip
}) => {
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

  const isTooltipValid = component.tooltipId ? 
    tooltipOptions.some(option => option.id === component.tooltipId) : 
    true;
  
  if (component.tooltipId && !isTooltipValid && onApplyTooltip) {
    setTimeout(() => {
      onApplyTooltip("");
    }, 0);
  }

  return (
    <div className="mb-4">
      <label className="text-sm font-medium mb-2 block">Component Tooltip</label>
      <div className="flex items-center gap-2">
        {component.tooltipId && component.tooltipId !== "none" && getTooltipIcon(component.tooltipId)}
        <Select
          value={component.tooltipId || "none"}
          onValueChange={(value) => onApplyTooltip(value === "none" ? "" : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select tooltip type" />
          </SelectTrigger>
          <SelectContent>
            {tooltipOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TooltipSelector;
