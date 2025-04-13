
import React from 'react';
import { NavigateFunction } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Tooltip } from "@/components/widget-builder/TooltipManager";

interface WidgetActionsProps {
  widgetComponents: WidgetComponent[];
  apis: ApiConfig[];
  tooltips: Tooltip[];
  isEditing: boolean;
  widgetId: string | null;
  navigate: NavigateFunction;
  setIsEditing: (isEditing: boolean) => void;
  onSubmitSuccess: () => void;
}

const WidgetActions: React.FC<WidgetActionsProps> = ({
  widgetComponents,
  apis,
  tooltips,
  isEditing,
  widgetId,
  navigate,
  setIsEditing,
  onSubmitSuccess
}) => {
  const { toast } = useToast();

  const handleSaveWidget = () => {
    const widgetConfig = {
      components: widgetComponents,
      apis: apis,
      tooltips: tooltips
    };
    
    localStorage.setItem('savedWidget', JSON.stringify(widgetConfig));
    
    toast({
      title: "Widget Saved",
      description: "Your widget configuration has been saved."
    });
  };

  const handleLoadWidget = () => {
    navigate('/library?mode=select');
    setIsEditing(false);
  };

  const handleNewWidget = () => {
    setIsEditing(false);
    navigate('/');
    
    toast({
      title: "New Widget Started",
      description: "You can now start building a new widget from scratch."
    });
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    navigate('/');
    toast({
      title: "Editing Cancelled",
      description: "Changes to the widget have been discarded."
    });
  };

  // Return null or an empty fragment to make this a valid React component
  return <>{null}</>;
};

export default WidgetActions;

// Export the hook for direct use
export const useWidgetActions = (
  widgetComponents: WidgetComponent[],
  apis: ApiConfig[],
  tooltips: Tooltip[],
  isEditing: boolean,
  widgetId: string | null,
  navigate: NavigateFunction,
  setIsEditing: (isEditing: boolean) => void
) => {
  const { toast } = useToast();

  const handleSaveWidget = () => {
    const widgetConfig = {
      components: widgetComponents,
      apis: apis,
      tooltips: tooltips
    };
    
    localStorage.setItem('savedWidget', JSON.stringify(widgetConfig));
    
    toast({
      title: "Widget Saved",
      description: "Your widget configuration has been saved."
    });
  };

  const handleLoadWidget = () => {
    navigate('/library?mode=select');
    setIsEditing(false);
  };

  const handleNewWidget = () => {
    setIsEditing(false);
    navigate('/');
    
    toast({
      title: "New Widget Started",
      description: "You can now start building a new widget from scratch."
    });
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    navigate('/');
    toast({
      title: "Editing Cancelled",
      description: "Changes to the widget have been discarded."
    });
  };

  const onSubmitSuccess = () => {
    setIsEditing(false);
    navigate('/');
    toast({
      title: "Widget Submitted",
      description: "Your widget has been submitted successfully."
    });
  };

  return {
    handleSaveWidget,
    handleLoadWidget,
    handleNewWidget,
    handleCancelEditing,
    onSubmitSuccess
  };
};
