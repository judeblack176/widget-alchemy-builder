
import { WidgetComponent } from "@/types/widget-types";
import { cleanHtmlContent } from "../../component-renderers/renderComponentWithoutTooltip";

export const useComponentDisplay = (component: WidgetComponent) => {
  // Is this a header component?
  const isHeader = component.type === 'header';
  
  // Clean the component title for display in the editor
  const getDisplayComponent = () => {
    let displayComponent = { ...component };
    
    if (component.formattedContent) {
      const cleanContent = cleanHtmlContent(component.formattedContent);
      
      // For header, also update the name property to show clean content
      if (isHeader && displayComponent.props) {
        displayComponent = {
          ...displayComponent,
          props: {
            ...displayComponent.props,
            name: cleanContent
          }
        };
      }
    }
    
    return displayComponent;
  };

  return {
    isHeader,
    getDisplayComponent
  };
};

export default useComponentDisplay;
