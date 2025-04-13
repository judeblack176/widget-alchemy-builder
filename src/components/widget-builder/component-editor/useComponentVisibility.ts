
import { ComponentType } from "@/types/component-types";

export const useComponentVisibility = (componentType: ComponentType) => {
  // These components support API integration
  const supportsApiIntegration = [
    'text', 
    'multi-text', 
    'table', 
    'chart', 
    'alert'  // Removed 'image' from API integration support
  ].includes(componentType);

  // These components support content editing
  const supportsContentEditor = [
    'text', 
    'header', 
    'button', 
    'link', 
    'multi-text',
    'alert'
  ].includes(componentType);

  return {
    shouldShowDataIntegration: () => supportsApiIntegration,
    shouldShowContentEditor: () => supportsContentEditor
  };
};
