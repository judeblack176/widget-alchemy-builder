
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Send, CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react";
import { useWidget } from "@/contexts/WidgetContext";
import SubmissionForm from "./SubmissionForm";
import SubmissionButton from "./SubmissionButton";
import { WidgetComponent, ApiConfig, WidgetSubmission } from "@/types";

interface SubmissionFormDialogProps {
  widgetComponents: WidgetComponent[];
  apis: ApiConfig[];
  onSubmitSuccess: () => void;
  widgetId?: string | null;
  isEditing?: boolean;
  onCancelEditing?: () => void;
}

const SubmissionFormDialog: React.FC<SubmissionFormDialogProps> = ({
  widgetComponents,
  apis,
  onSubmitSuccess,
  widgetId,
  isEditing,
  onCancelEditing
}) => {
  const { toast } = useToast();
  const { setIsEditing } = useWidget();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    tags: ""
  });
  const [submissionStatus, setSubmissionStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (widgetId) {
      try {
        const savedSubmissions = localStorage.getItem('widgetSubmissions');
        if (savedSubmissions) {
          const submissions: WidgetSubmission[] = JSON.parse(savedSubmissions);
          const submission = submissions.find(s => s.id === widgetId);
          
          if (submission) {
            setFormData({
              name: submission.name || "",
              description: submission.description || "",
              category: submission.category || "",
              tags: submission.tags ? submission.tags.join(', ') : ""
            });
            setSubmissionStatus(submission.status as any);
          }
        }
      } catch (error) {
        console.error("Failed to load widget submission data", error);
      }
    }
  }, [widgetId]);

  useEffect(() => {
    // When editing, we want to set hasChanges to true
    if (isEditing && submissionStatus !== 'none') {
      setHasChanges(true);
    }
  }, [isEditing, submissionStatus]);

  const handleCancelEditingClick = () => {
    setOpen(false);
    if (onCancelEditing) {
      onCancelEditing();
    } else {
      setIsEditing(false);
    }
  };

  const handleSubmit = (formValues: typeof formData) => {
    if (!formValues.name) {
      toast({
        title: "Missing Information",
        description: "Please provide a name for your widget",
        variant: "destructive"
      });
      return;
    }

    // Create submission object
    const submission: WidgetSubmission = {
      id: widgetId || `widget-${Date.now()}`,
      name: formValues.name,
      description: formValues.description,
      createdAt: widgetId ? new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending',
      config: {
        components: widgetComponents,
        apis: apis
      },
      author: "Current User", // In a real app, this would be the authenticated user
      tags: formValues.tags ? formValues.tags.split(',').map(tag => tag.trim()) : [],
      version: "1.0.0",
      category: formValues.category || "Uncategorized"
    };

    // In a real app, this would be sent to an API
    // For now, store in localStorage
    try {
      const existingSubmissions = localStorage.getItem('widgetSubmissions');
      const submissions = existingSubmissions ? JSON.parse(existingSubmissions) : [];
      
      if (widgetId) {
        // Update existing submission
        const index = submissions.findIndex((s: WidgetSubmission) => s.id === widgetId);
        if (index !== -1) {
          submissions[index] = submission;
        } else {
          submissions.push(submission);
        }
      } else {
        // New submission
        submissions.push(submission);
      }
      
      localStorage.setItem('widgetSubmissions', JSON.stringify(submissions));
      
      toast({
        title: hasChanges ? "Widget Resubmitted" : "Widget Submitted",
        description: hasChanges 
          ? "Your updated widget has been submitted for review again" 
          : "Your widget has been submitted for approval",
      });
      
      setOpen(false);
      setSubmissionStatus('pending');
      setHasChanges(false);
      setIsEditing(false);
      
      onSubmitSuccess();
    } catch (error) {
      console.error("Failed to save widget submission", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your widget",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SubmissionButton 
          status={submissionStatus} 
          hasChanges={hasChanges} 
          widgetId={widgetId} 
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
          setFormData={setFormData}
          onSubmit={() => handleSubmit(formData)}
          onCancel={() => setOpen(false)}
          isEditing={isEditing}
          hasChanges={hasChanges}
          onCancelEditing={handleCancelEditingClick}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionFormDialog;
