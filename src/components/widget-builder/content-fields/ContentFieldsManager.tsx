
import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import FormattedTextEditor from "./FormattedTextEditor";

interface ContentFieldsManagerProps {
  component: WidgetComponent;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
}

const ContentFieldsManager: React.FC<ContentFieldsManagerProps> = ({
  component,
  onUpdateComponent
}) => {
  return <FormattedTextEditor component={component} onUpdateComponent={onUpdateComponent} />;
};

export default ContentFieldsManager;
