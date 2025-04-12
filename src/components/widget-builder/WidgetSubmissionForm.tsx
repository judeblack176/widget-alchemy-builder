
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Send, CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react";
import type { WidgetComponent, ApiConfig, WidgetConfig, WidgetSubmission } from "@/types/widget-types";

interface WidgetSubmissionFormProps {
  widgetComponents: WidgetComponent[];
  apis: ApiConfig[];
  onSubmitSuccess: () => void;
  widgetId?: string | null;
  isEditing?: boolean;
}

const WidgetSubmissionForm: React.FC<WidgetSubmissionFormProps> = ({
  widgetComponents,
  apis,
  onSubmitSuccess,
  widgetId,
  isEditing
}) => {
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
    if (isEditing && submissionStatus !== 'none') {
      setHasChanges(true);
    }
  }, [isEditing, submissionStatus]);

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

  const renderSubmitButton = () => {
    if (!widgetId || submissionStatus === 'none') {
      return (
        <Button className="bg-widget-blue">
          <Send size={16} className="mr-2" /> Submit for Approval
        </Button>
      );
    }

    if (hasChanges) {
      return (
        <Button className="bg-widget-blue">
          <RefreshCw size={16} className="mr-2" /> Resubmit for Approval
        </Button>
      );
    }

    switch (submissionStatus) {
      case 'pending':
        return (
          <Button variant="outline" disabled className="border-amber-500 text-amber-500">
            <Clock size={16} className="mr-2" /> Pending Approval
          </Button>
        );
      case 'approved':
        return (
          <Button variant="outline" disabled className="border-green-500 text-green-500">
            <CheckCircle size={16} className="mr-2" /> Approved
          </Button>
        );
      case 'rejected':
        return (
          <Button variant="outline" disabled className="border-red-500 text-red-500">
            <XCircle size={16} className="mr-2" /> Rejected
          </Button>
        );
      default:
        return (
          <Button className="bg-widget-blue">
            <Send size={16} className="mr-2" /> Submit for Approval
          </Button>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {renderSubmitButton()}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{hasChanges ? "Resubmit Widget for Approval" : "Submit Widget for Approval"}</DialogTitle>
          <DialogDescription>
            Provide details about your widget for the approval process
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Widget Name *</Label>
            <Input 
              id="name" 
              name="name"
              value={formData.name} 
              onChange={handleInputChange} 
              placeholder="Enter a descriptive name" 
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description"
              value={formData.description} 
              onChange={handleInputChange} 
              placeholder="Describe what your widget does"
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Input 
              id="category" 
              name="category"
              value={formData.category} 
              onChange={handleInputChange} 
              placeholder="e.g., Educational, Analytics, Communication"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="tags">Tags</Label>
            <Input 
              id="tags" 
              name="tags"
              value={formData.tags} 
              onChange={handleInputChange} 
              placeholder="Enter comma-separated tags"
            />
            <p className="text-xs text-gray-500">Separate tags with commas (e.g., interactive, data-driven, responsive)</p>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{hasChanges ? "Resubmit" : "Submit"} Widget</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WidgetSubmissionForm;
