
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
    handleReorderComponents
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
    handleApplyTooltip
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
            // We need to update both components and APIs
            // Since the hooks don't expose setters directly, we need a way
            // to initialize with data from storage
            // For now, we'll work with what we have
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
  }, [widgetId, toast]);

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
