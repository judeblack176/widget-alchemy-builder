
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tooltip } from "@/components/widget-builder/TooltipManager";
import { WidgetComponent } from "@/types/widget-types";

export const useTooltipState = (widgetComponents: WidgetComponent[]) => {
  const { toast } = useToast();
  const [tooltips, setTooltips] = useState<Tooltip[]>([]);

  useEffect(() => {
    try {
      const savedTooltips = localStorage.getItem('savedTooltips');
      if (savedTooltips) {
        setTooltips(JSON.parse(savedTooltips));
      }
    } catch (error) {
      console.error("Failed to load saved tooltips", error);
    }
  }, []);

  const handleAddTooltip = (tooltip: Tooltip) => {
    const updatedTooltips = [...tooltips, tooltip];
    setTooltips(updatedTooltips);
    localStorage.setItem('savedTooltips', JSON.stringify(updatedTooltips));
  };

  const handleUpdateTooltip = (tooltipId: string, updatedTooltip: Tooltip) => {
    const updatedTooltips = tooltips.map(tooltip => 
      tooltip.id === tooltipId ? updatedTooltip : tooltip
    );
    setTooltips(updatedTooltips);
    localStorage.setItem('savedTooltips', JSON.stringify(updatedTooltips));
  };

  const handleRemoveTooltip = (tooltipId: string) => {
    const componentsUsingTooltip = widgetComponents.filter(comp => comp.tooltipId === tooltipId);
    
    if (componentsUsingTooltip.length > 0) {
      toast({
        title: "Cannot Remove Tooltip",
        description: `This tooltip is being used by ${componentsUsingTooltip.length} component(s). Please remove the tooltip from these components first.`,
        variant: "destructive"
      });
      return;
    }
    
    const updatedTooltips = tooltips.filter(tooltip => tooltip.id !== tooltipId);
    setTooltips(updatedTooltips);
    localStorage.setItem('savedTooltips', JSON.stringify(updatedTooltips));
  };

  const handleApplyTooltip = (componentId: string, tooltipId: string) => {
    // This function just shows a toast notification
    // The actual component update happens in the parent component
    const tooltipDisplay = tooltipId ? 
      tooltips.find(t => t.id === tooltipId)?.title || tooltipId : 
      "none";
    
    toast({
      title: tooltipId ? "Tooltip Applied" : "Tooltip Removed",
      description: tooltipId ? 
        `Tooltip "${tooltipDisplay}" has been applied to the component.` : 
        "Tooltip has been removed from the component."
    });
  };

  return {
    tooltips,
    setTooltips,
    handleAddTooltip,
    handleUpdateTooltip,
    handleRemoveTooltip,
    handleApplyTooltip
  };
};
