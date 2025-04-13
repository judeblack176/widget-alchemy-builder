
import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import PropertyField from "./PropertyField";
import { getPropertyDefinitions } from "../propertyDefinitions";

interface GeneralPropertiesProps {
  component: WidgetComponent;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  excludeProperties?: string[]; // New prop to exclude specific properties
}

const GeneralProperties: React.FC<GeneralPropertiesProps> = ({
  component,
  onUpdateComponent,
  excludeProperties = []
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
    if ('alertPropertiesSection' in component) {
      const section = (component as any).alertPropertiesSection;
      
      // Initial section: show title and type only
      if (section === 'initial' && titleDef && typeDef) {
        propertyDefinitions = [titleDef, typeDef];
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
  
  // Filter out excluded properties
  if (excludeProperties.length > 0) {
    propertyDefinitions = propertyDefinitions.filter(
      prop => !excludeProperties.includes(prop.name)
    );
  }
  
  // Change header title for alert components to "Alert Settings"
  // For sectioned alert properties, use more specific headers
  let headerTitle = component.type === 'alert' ? "Alert Settings" : "Properties";
  if (component.type === 'alert' && 'alertPropertiesSection' in component) {
    const section = (component as any).alertPropertiesSection;
    if (section === 'initial') {
      headerTitle = "Alert Type";
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
