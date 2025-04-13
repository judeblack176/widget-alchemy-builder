
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSubmissionState } from "./useSubmissionState";
import SubmissionStatusButton from "./SubmissionStatusButton";
import SubmissionForm from "./SubmissionForm";
import type { WidgetComponent, ApiConfig } from "@/types/widget-types";

interface WidgetSubmissionFormProps {
  widgetComponents: WidgetComponent[];
  apis: ApiConfig[];
  onSubmitSuccess: () => void;
  widgetId?: string | null;
  isEditing?: boolean;
  onCancelEditing?: () => void;
}

const WidgetSubmissionForm: React.FC<WidgetSubmissionFormProps> = ({
  widgetComponents,
  apis,
  onSubmitSuccess,
  widgetId,
  isEditing,
  onCancelEditing
}) => {
  const {
    open,
    setOpen,
    formData,
    submissionStatus,
    hasChanges,
    handleInputChange,
    handleSubmit
  } = useSubmissionState({ 
    widgetId, 
    widgetComponents, 
    apis, 
    onSubmitSuccess 
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SubmissionStatusButton 
          submissionStatus={submissionStatus}
          hasChanges={hasChanges}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{hasChanges ? "Resubmit Widget for Approval" : "Submit Widget for Approval"}</DialogTitle>
          <DialogDescription>
            Provide details about your widget for the approval process
          </DialogDescription>
        </DialogHeader>
        
        <SubmissionForm
          formData={formData}
          hasChanges={hasChanges}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          isEditing={isEditing}
          onCancelEditing={() => {
            setOpen(false);
            if (onCancelEditing) onCancelEditing();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WidgetSubmissionForm;
