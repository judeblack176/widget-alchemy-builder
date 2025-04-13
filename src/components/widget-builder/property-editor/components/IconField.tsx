
import React from "react";
import { PropertyDefinition } from "../propertyDefinitions";
import PropertyField from "./PropertyField";

interface IconFieldProps {
  property: PropertyDefinition;
  value: any;
  onChange: (propertyName: string, value: any) => void;
}

const IconField: React.FC<IconFieldProps> = ({
  property,
  value,
  onChange
}) => {
  return (
    <PropertyField 
      key={property.name}
      property={property} 
      value={value} 
      onChange={onChange} 
    />
  );
};

export default IconField;
