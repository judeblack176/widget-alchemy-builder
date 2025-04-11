
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Send } from "lucide-react";
import type { WidgetComponent, ApiConfig, WidgetConfig, WidgetSubmission } from "@/types/widget-types";

interface WidgetSubmissionFormProps {
  widgetComponents: WidgetComponent[];
  apis: ApiConfig[];
  onSubmitSuccess: () => void;
}

const WidgetSubmissionForm: React.FC<WidgetSubmissionFormProps> = ({
  widgetComponents,
  apis,
  onSubmitSuccess
}) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    tags: ""
  });

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
      id: `widget-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      createdAt: new Date().toISOString(),
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
      submissions.push(submission);
      localStorage.setItem('widgetSubmissions', JSON.stringify(submissions));
      
      toast({
        title: "Widget Submitted",
        description: "Your widget has been submitted for approval",
      });
      
      setOpen(false);
      setFormData({
        name: "",
        description: "",
        category: "",
        tags: ""
      });
      
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
        <Button className="bg-widget-blue">
          <Send size={16} className="mr-2" /> Submit for Approval
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit Widget for Approval</DialogTitle>
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
            <Button type="submit">Submit Widget</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WidgetSubmissionForm;
