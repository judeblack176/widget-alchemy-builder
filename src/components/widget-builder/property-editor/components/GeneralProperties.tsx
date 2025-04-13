
import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import PropertyField from "./PropertyField";
import { getPropertyDefinitions } from "../propertyDefinitions";

interface GeneralPropertiesProps {
  component: WidgetComponent & { alertPropertiesSection?: 'initial' | 'end' | 'title' | 'type' };
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
}

const GeneralProperties: React.FC<GeneralPropertiesProps> = ({
  component,
  onUpdateComponent
}) => {
  const handlePropertyChange = (propertyName: string, value: any) => {
    const updatedComponent = {
      ...component,
      props: {
        ...component.props,
        [propertyName]: value,
      },
    };
    onUpdateComponent(updatedComponent);
  };

  // Get property definitions but reorder for alert components
  let propertyDefinitions = getPropertyDefinitions(component.type);
  
  // For alert components, reorder and filter properties based on section
  if (component.type === 'alert') {
    // Find all alert properties
    const titleDef = propertyDefinitions.find(p => p.name === 'title');
    const typeDef = propertyDefinitions.find(p => p.name === 'type');
    const dismissibleDef = propertyDefinitions.find(p => p.name === 'dismissible');
    const autoCloseDef = propertyDefinitions.find(p => p.name === 'autoClose');
    
    // If this is a sectioned alert component, show only the relevant properties
    if (component.alertPropertiesSection) {
      const section = component.alertPropertiesSection;
      
      // Initial section: show only type (title is now handled separately)
      if (section === 'initial' && typeDef) {
        propertyDefinitions = [typeDef];
      }
      // Type section: handled by FormattedTextEditor
      else if (section === 'type' && typeDef) {
        propertyDefinitions = [typeDef]; 
      }
      // Title section: handled by FormattedTextEditor
      else if (section === 'title' && titleDef) {
        propertyDefinitions = [titleDef];
      }
      // End section: show dismissible and autoClose only
      else if (section === 'end' && dismissibleDef && autoCloseDef) {
        propertyDefinitions = [dismissibleDef, autoCloseDef];
      }
    }
    // If no section specified, show all alert properties in order
    else if (titleDef && typeDef && dismissibleDef && autoCloseDef) {
      propertyDefinitions = [titleDef, typeDef, dismissibleDef, autoCloseDef];
    }
  }
  
  // Change header title for alert components to "Alert Settings"
  // For sectioned alert properties, use more specific headers
  let headerTitle = component.type === 'alert' ? "Alert Settings" : "Properties";
  if (component.type === 'alert' && component.alertPropertiesSection) {
    const section = component.alertPropertiesSection;
    if (section === 'initial') {
      headerTitle = "Alert Type";
    } else if (section === 'type') {
      headerTitle = "Alert Type";
    } else if (section === 'title') {
      headerTitle = "Alert Title";
    } else if (section === 'end') {
      headerTitle = "Alert Display Options";
    }
  }

  return (
    <div>
      <h3 className="text-sm font-semibold mb-4">{headerTitle}</h3>
      <div className="space-y-1">
        {propertyDefinitions.map((property) => (
          <PropertyField 
            key={property.name}
            property={property} 
            value={component.props?.[property.name]} 
            onChange={handlePropertyChange} 
          />
        ))}
      </div>
    </div>
  );
};

export default GeneralProperties;
