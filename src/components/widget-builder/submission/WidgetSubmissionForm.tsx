
import React from "react";
import SubmissionFormDialog from "./SubmissionFormDialog";
import { WidgetComponent, ApiConfig } from "@/types";

interface WidgetSubmissionFormProps {
  widgetComponents: WidgetComponent[];
  apis: ApiConfig[];
  onSubmitSuccess: () => void;
  widgetId?: string | null;
  isEditing?: boolean;
  onCancelEditing?: () => void;
}

// This component is a wrapper for backward compatibility
const WidgetSubmissionForm: React.FC<WidgetSubmissionFormProps> = (props) => {
  return <SubmissionFormDialog {...props} />;
};

export default WidgetSubmissionForm;
