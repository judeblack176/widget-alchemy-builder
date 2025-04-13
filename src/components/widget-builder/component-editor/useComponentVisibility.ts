
import { ComponentType } from "@/types/component-types";

export const useComponentVisibility = (componentType: ComponentType) => {
  // These components support API integration
  const supportsApiIntegration = [
    'text', 
    'image', 
    'multi-text', 
    'table', 
    'chart', 
    'alert'  // Added alert to the list that supports API integration
  ].includes(componentType);

  // These components support content editing
  const supportsContentEditor = [
    'text', 
    'header', 
    'button', 
    'link', 
    'multi-text',
    'alert'  // Added alert to show content editor
  ].includes(componentType);

  return {
    shouldShowDataIntegration: () => supportsApiIntegration,
    shouldShowContentEditor: () => supportsContentEditor
  };
};
