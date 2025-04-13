
import { WidgetComponent } from "@/types/widget-types";

export const useComponentVisibility = (componentType: string) => {
  const shouldShowDataIntegration = () => {
    const dataIntegrationComponents = ['text', 'alert', 'chart', 'calendar', 'multi-text', 'table', 'searchbar'];
    return dataIntegrationComponents.includes(componentType);
  };

  const shouldShowContentEditor = () => {
    const contentEditorComponents = ['text', 'alert', 'multi-text'];
    return contentEditorComponents.includes(componentType);
  };

  return {
    shouldShowDataIntegration,
    shouldShowContentEditor
  };
};
