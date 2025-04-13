
import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import HeaderProperties from "./components/HeaderProperties";
import GeneralProperties from "./components/GeneralProperties";

interface PropertyEditorProps {
  component: WidgetComponent;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({
  component,
  onUpdateComponent
}) => {
  // Special rendering for header components to ensure icon and name are always displayed
  if (component.type === 'header') {
    return <HeaderProperties component={component} onUpdateComponent={onUpdateComponent} />;
  }

  return <GeneralProperties component={component} onUpdateComponent={onUpdateComponent} />;
};

export default PropertyEditor;
