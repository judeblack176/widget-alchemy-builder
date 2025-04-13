
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WidgetComponent } from "@/types/widget-types";

export const useComponentState = () => {
  const { toast } = useToast();
  
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

  const handleAddComponent = (component: WidgetComponent | string) => {
    const componentToAdd = typeof component === 'string' 
      ? {
          id: `${component}-${Date.now()}`,
          type: component as any,
          props: {}
        } 
      : component;
    
    // Check if trying to add an Alert when one already exists
    if (componentToAdd.type === 'alert' && widgetComponents.some(c => c.type === 'alert')) {
      toast({
        title: "Alert Already Exists",
        description: "Only one alert component is allowed per widget.",
        variant: "destructive"
      });
      return;
    }
    
    const hasAlertComponent = widgetComponents.some(c => c.type === 'alert') || componentToAdd.type === 'alert';
    const MAX_COMPONENTS = hasAlertComponent ? 7 : 6;
    
    const nonHeaderNonAlertCount = widgetComponents.filter(
      c => c.type !== 'header' && c.type !== 'alert'
    ).length;
    
    if (nonHeaderNonAlertCount >= MAX_COMPONENTS && componentToAdd.type !== 'header' && componentToAdd.type !== 'alert') {
      toast({
        title: "Component Limit Reached",
        description: `Widgets are limited to ${MAX_COMPONENTS} components (excluding header and alerts). Please remove a component first.`,
        variant: "destructive"
      });
      return;
    }
    
    setWidgetComponents([...widgetComponents, componentToAdd]);
    toast({
      title: "Component Added",
      description: `Added ${componentToAdd.type} component to your widget.`
    });
  };

  const handleUpdateComponent = (updatedComponent: WidgetComponent) => {
    setWidgetComponents(widgetComponents.map(comp => 
      comp.id === updatedComponent.id ? updatedComponent : comp
    ));
  };

  const handleRemoveComponent = (componentId: string) => {
    setWidgetComponents(widgetComponents.filter(comp => comp.id !== componentId));
    toast({
      title: "Component Removed",
      description: "The component has been removed from your widget."
    });
  };

  const handleReorderComponents = (reorderedComponents: WidgetComponent[]) => {
    const headerComponent = reorderedComponents.find(c => c.type === 'header');
    const alertComponents = widgetComponents.filter(c => c.type === 'alert');
    const otherComponents = reorderedComponents.filter(c => c.type !== 'header' && c.type !== 'alert');
    
    let finalOrderComponents = [];
    
    if (headerComponent) {
      finalOrderComponents.push(headerComponent);
    }
    
    if (alertComponents.length > 0) {
      finalOrderComponents = [...finalOrderComponents, ...alertComponents];
    }
    
    finalOrderComponents = [...finalOrderComponents, ...otherComponents];
    
    setWidgetComponents(finalOrderComponents);
  };

  return {
    widgetComponents,
    handleAddComponent,
    handleUpdateComponent,
    handleRemoveComponent,
    handleReorderComponents
  };
};
