
import { ComponentType } from "@/types/widget-types";

interface ComponentVisibility {
  shouldShowDataIntegration: () => boolean;
  shouldShowContentEditor: () => boolean;
}

export const useComponentVisibility = (componentType: ComponentType): ComponentVisibility => {
  const shouldShowDataIntegration = () => {
    // Components that support data integration
    const supportsDataIntegration = [
      'text',
      'image',
      'chart',
      'table',
      'multi-text',
      'filter'
    ];
    
    return supportsDataIntegration.includes(componentType);
  };
  
  const shouldShowContentEditor = () => {
    // Components that support content editing
    const supportsContentEditor = [
      'text',
      'header',
      'button',
      'alert',
      'multi-text'
    ];
    
    return supportsContentEditor.includes(componentType);
  };
  
  return {
    shouldShowDataIntegration,
    shouldShowContentEditor
  };
};
