
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
    setApis,
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
          const submission = submissions.find((s: any) => s.id === widgetId);
          
          if (submission) {
            // Initialize with data from storage
            if (submission.components) {
              setWidgetComponents(submission.components);
            }
            
            if (submission.apis && setApis) {
              setApis(submission.apis);
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
  }, [widgetId, toast, setWidgetComponents, setApis, setTooltips]);

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
