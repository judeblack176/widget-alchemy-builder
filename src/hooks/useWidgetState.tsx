
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Tooltip } from "@/components/widget-builder/TooltipManager";
import { useComponentState } from "./useComponentState";
import { useApiState } from "./useApiState";
import { useTooltipState } from "./useTooltipState";
import { useWidgetEditState } from "./useWidgetEditState";

export const useWidgetState = (widgetId: string | null) => {
  const { toast } = useToast();
  
  // Use our more focused hooks
  const {
    widgetComponents,
    handleAddComponent,
    handleUpdateComponent,
    handleRemoveComponent,
    handleReorderComponents,
    setWidgetComponents
  } = useComponentState();
  
  const {
    apis,
    savedApiTemplates,
    handleAddApi,
    handleUpdateApi,
    handleRemoveApi
  } = useApiState(widgetComponents);
  
  const {
    tooltips,
    handleAddTooltip,
    handleUpdateTooltip,
    handleRemoveTooltip,
    handleApplyTooltip,
    setTooltips
  } = useTooltipState(widgetComponents);
  
  const {
    isEditing,
    setIsEditing
  } = useWidgetEditState(widgetId);

  useEffect(() => {
    if (widgetId) {
      try {
        const savedSubmissions = localStorage.getItem('widgetSubmissions');
        if (savedSubmissions) {
          const submissions = JSON.parse(savedSubmissions);
          const submission = submissions.find(s => s.id === widgetId);
          
          if (submission) {
            // Initialize with data from storage
            if (submission.components) {
              setWidgetComponents(submission.components);
            }
            
            if (submission.apis) {
              // Since useApiState doesn't expose setApis, this would need refactoring
              // For now we use what's available - this is a TODO item
            }
            
            if (submission.tooltips) {
              setTooltips(submission.tooltips);
            }
            
            toast({
              title: `Loaded: ${submission.name}`,
              description: `Status: ${submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}`
            });
          }
        }
      } catch (error) {
        console.error("Failed to load widget from ID", error);
      }
    }
  }, [widgetId, toast, setWidgetComponents, setTooltips]);

  return {
    widgetComponents,
    apis,
    tooltips,
    isEditing,
    savedApiTemplates,
    handleAddComponent,
    handleUpdateComponent,
    handleRemoveComponent,
    handleReorderComponents,
    handleAddApi,
    handleUpdateApi,
    handleRemoveApi,
    handleAddTooltip,
    handleUpdateTooltip,
    handleRemoveTooltip,
    handleApplyTooltip,
    setIsEditing,
  };
};
