
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { WidgetComponent, ApiConfig, WidgetSubmission } from "@/types/widget-types";

interface UseSubmissionStateProps {
  widgetId: string | null | undefined;
  widgetComponents: WidgetComponent[];
  apis: ApiConfig[];
  onSubmitSuccess: () => void;
}

export const useSubmissionState = ({ 
  widgetId, 
  widgetComponents, 
  apis, 
  onSubmitSuccess 
}: UseSubmissionStateProps) => {
  const { toast } = useToast();
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
    if (submissionStatus !== 'none') {
      setHasChanges(true);
    }
  }, [submissionStatus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
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
      name: formData.name,
      description: formData.description,
      createdAt: widgetId ? new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending',
      config: {
        components: widgetComponents,
        apis: apis
      },
      author: "Current User", // In a real app, this would be the authenticated user
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      version: "1.0.0",
      category: formData.category || "Uncategorized"
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

  return {
    open,
    setOpen,
    formData,
    submissionStatus,
    hasChanges,
    handleInputChange,
    handleSubmit
  };
};
