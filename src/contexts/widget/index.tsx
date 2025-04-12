
import React, { createContext, useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  WidgetComponent, 
  ApiConfig, 
  Tooltip
} from "@/types";
import { WidgetContextType } from "./types";
import { createComponentHandlers } from "./component-handlers";
import { createApiHandlers } from "./api-handlers";
import { createTooltipHandlers } from "./tooltip-handlers";
import { createApiTemplateHandlers } from "./api-template-handlers";
import { loadWidgetFromId, loadSavedData } from "./utils";

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

export const WidgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const widgetId = queryParams.get('widgetId');

  const [widgetComponents, setWidgetComponents] = useState<WidgetComponent[]>([
    {
      id: "header-1",
      type: "header",
      props: {
        icon: "BookOpen",
        title: "Learning Module",
        actions: ["Edit", "More"]
      }
    }
  ]);
  
  const [apis, setApis] = useState<ApiConfig[]>([]);
  const [tooltips, setTooltips] = useState<Tooltip[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isApiTemplateModalOpen, setIsApiTemplateModalOpen] = useState(false);
  const [isTooltipListModalOpen, setIsTooltipListModalOpen] = useState(false);
  const [savedApiTemplates, setSavedApiTemplates] = useState<ApiConfig[]>([]);

  useEffect(() => {
    if (widgetId) {
      setIsEditing(true);
      const submission = loadWidgetFromId(widgetId);
      
      if (submission) {
        setWidgetComponents(submission.config.components);
        setApis(submission.config.apis || []);
        
        toast({
          title: `Loaded: ${submission.name}`,
          description: `Status: ${submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}`
        });
      }
    }
    
    const savedData = loadSavedData();
    if (savedData.savedApiTemplates) {
      setSavedApiTemplates(savedData.savedApiTemplates);
    }
    
    if (savedData.tooltips) {
      setTooltips(savedData.tooltips);
    }
  }, [widgetId, toast]);

  // Create all handlers
  const componentHandlers = createComponentHandlers(widgetComponents, setWidgetComponents, toast);
  const apiHandlers = createApiHandlers(apis, setApis, widgetComponents, toast);
  const tooltipHandlers = createTooltipHandlers(tooltips, setTooltips, widgetComponents, toast);
  const apiTemplateHandlers = createApiTemplateHandlers(
    widgetComponents, 
    componentHandlers.handleUpdateComponent, 
    apis, 
    setApis, 
    toast
  );

  // Create a modified handleApplyTooltip that updates the components
  const handleApplyTooltip = (componentId: string, tooltipId: string) => {
    setWidgetComponents(widgetComponents.map(comp => 
      comp.id === componentId ? { ...comp, tooltipId } : comp
    ));
    
    tooltipHandlers.handleApplyTooltip(componentId, tooltipId);
  };

  // Create a modified openApiTemplateModal that sets the selectedComponentId
  const openApiTemplateModal = (componentId: string) => {
    setSelectedComponentId(componentId);
    setIsApiTemplateModalOpen(true);
  };

  // Create a wrapper for applyApiTemplateToComponent that uses the state
  const applyApiTemplateToComponent = (template: ApiConfig) => {
    apiTemplateHandlers.applyApiTemplateToComponent(
      template, 
      selectedComponentId,
      setIsApiTemplateModalOpen
    );
  };

  const value: WidgetContextType = {
    widgetComponents,
    apis,
    tooltips,
    selectedComponentId,
    isEditing,
    isApiTemplateModalOpen,
    isTooltipListModalOpen,
    savedApiTemplates,
    setWidgetComponents,
    setApis,
    setTooltips,
    setSelectedComponentId,
    setIsEditing,
    setIsApiTemplateModalOpen,
    setIsTooltipListModalOpen,
    setSavedApiTemplates,
    ...componentHandlers,
    ...apiHandlers,
    ...tooltipHandlers,
    openApiTemplateModal,
    applyApiTemplateToComponent
  };

  return (
    <WidgetContext.Provider value={value}>
      {children}
    </WidgetContext.Provider>
  );
};

export const useWidget = () => {
  const context = useContext(WidgetContext);
  if (context === undefined) {
    throw new Error("useWidget must be used within a WidgetProvider");
  }
  return context;
};
