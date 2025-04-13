
import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import PropertyField from "./PropertyField";
import { getPropertyDefinitions } from "../propertyDefinitions";

interface GeneralPropertiesProps {
  component: WidgetComponent;
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
  
  // For alert components, reorder properties specifically
  if (component.type === 'alert') {
    // Reorder alert properties to match specific requirements
    const titleDef = propertyDefinitions.find(p => p.name === 'title');
    const typeDef = propertyDefinitions.find(p => p.name === 'type');
    const contentDef = propertyDefinitions.find(p => p.name === 'content');
    const dismissibleDef = propertyDefinitions.find(p => p.name === 'dismissible');
    const autoCloseDef = propertyDefinitions.find(p => p.name === 'autoClose');
    
    // Explicitly set the order: title, type, content, dismissible, autoClose
    if (titleDef && typeDef && contentDef && dismissibleDef && autoCloseDef) {
      propertyDefinitions = [
        titleDef,
        typeDef,
        contentDef,
        dismissibleDef,
        autoCloseDef
      ];
    }
  }
  
  // Change header title for alert components to "Alert Settings"
  const headerTitle = component.type === 'alert' ? "Alert Settings" : "Properties";

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
