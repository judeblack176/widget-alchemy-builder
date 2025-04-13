import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import HeaderProperties from "./components/HeaderProperties";
import GeneralProperties from "./components/GeneralProperties";
import { cleanHtmlContent } from "../component-renderers/renderComponentWithoutTooltip";
import FormattedTextEditor from "../content-fields/FormattedTextEditor";

interface PropertyEditorProps {
  component: WidgetComponent & { alertPropertiesSection?: 'initial' | 'end' | 'title' };
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({
  component,
  onUpdateComponent
}) => {
  // Special rendering for header components to ensure icon and name are always displayed
  if (component.type === 'header') {
    // Create a display version of the component with clean content for display
    const displayComponent = { ...component };
    
    if (component.formattedContent && displayComponent.props) {
      const cleanContent = cleanHtmlContent(component.formattedContent);
      displayComponent.props = {
        ...displayComponent.props,
        name: cleanContent
      };
    }
    
    return <HeaderProperties component={displayComponent} onUpdateComponent={onUpdateComponent} />;
  }

  // Special handling for alert title with API fields
  if (component.type === 'alert' && component.alertPropertiesSection === 'title') {
    return (
      <div>
        <h3 className="text-sm font-semibold mb-4">Alert Title</h3>
        <FormattedTextEditor
          component={component}
          onUpdateComponent={(updatedComponent) => {
            // When the title is updated, update both formattedContent and title prop
            const updatedProps = {
              ...updatedComponent.props,
              title: updatedComponent.formattedContent || updatedComponent.props?.title
            };
            
            // Create a clean component without the section property
            const { alertPropertiesSection, ...cleanComponent } = updatedComponent as any;
            
            // Update the component with new title in both places
            onUpdateComponent({
              ...cleanComponent,
              props: updatedProps
            } as WidgetComponent);
          }}
          singleLine={true}
          customLabel="Alert Title"
        />
      </div>
    );
  }

  // For alert components with section specified, pass the section info to GeneralProperties
  if (component.type === 'alert' && ('alertPropertiesSection' in component)) {
    return (
      <GeneralProperties 
        component={component} 
        onUpdateComponent={(updatedComponent) => {
          // Remove the temporary section property before updating
          const { alertPropertiesSection, ...cleanComponent } = updatedComponent as any;
          onUpdateComponent(cleanComponent as WidgetComponent);
        }} 
      />
    );
  }

  return <GeneralProperties component={component} onUpdateComponent={onUpdateComponent} />;
};

export default PropertyEditor;
