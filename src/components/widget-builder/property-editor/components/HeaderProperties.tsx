
import React, { useEffect } from "react";
import { WidgetComponent } from "@/types/widget-types";
import { getPropertyDefinitions } from "../propertyDefinitions";
import IconField from "./IconField";

interface HeaderPropertiesProps {
  component: WidgetComponent;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
}

const HeaderProperties: React.FC<HeaderPropertiesProps> = ({
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
    
    // If the name is being changed, sync to formattedContent too
    if (propertyName === 'name') {
      updatedComponent.formattedContent = value;
    }
    
    onUpdateComponent(updatedComponent);
  };

  // Ensure name and formattedContent are synchronized
  useEffect(() => {
    if (component.formattedContent && component.props?.name !== component.formattedContent) {
      handlePropertyChange('name', component.formattedContent);
    }
  }, [component.formattedContent]);

  const propertyDefinitions = getPropertyDefinitions(component.type);
  // Only show icon property 
  const iconProperty = propertyDefinitions.find(p => p.name === 'icon');
  
  return (
    <div>
      <h3 className="text-sm font-semibold mb-4">Icon</h3>
      <div className="space-y-1">
        {/* Show icon property */}
        {iconProperty && (
          <IconField 
            property={iconProperty} 
            value={component.props?.[iconProperty.name]} 
            onChange={handlePropertyChange} 
          />
        )}
      </div>
    </div>
  );
};

export default HeaderProperties;
