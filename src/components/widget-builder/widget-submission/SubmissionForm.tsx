
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface SubmissionFormData {
  name: string;
  description: string;
  category: string;
  tags: string;
}

interface SubmissionFormProps {
  formData: SubmissionFormData;
  hasChanges: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing?: boolean;
  onCancelEditing?: () => void;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({
  formData,
  hasChanges,
  onInputChange,
  onSubmit,
  onCancel,
  isEditing,
  onCancelEditing
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Widget Name *</Label>
        <Input 
          id="name" 
          name="name"
          value={formData.name} 
          onChange={onInputChange} 
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
          onChange={onInputChange} 
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
          onChange={onInputChange} 
          placeholder="e.g., Educational, Analytics, Communication"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="tags">Tags</Label>
        <Input 
          id="tags" 
          name="tags"
          value={formData.tags} 
          onChange={onInputChange} 
          placeholder="Enter comma-separated tags"
        />
        <p className="text-xs text-gray-500">Separate tags with commas (e.g., interactive, data-driven, responsive)</p>
      </div>
      
      <DialogFooter>
        {onCancelEditing && isEditing && (
          <Button type="button" variant="outline" onClick={onCancelEditing}>
            Cancel Editing
          </Button>
        )}
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className={hasChanges ? "bg-orange-500 text-white hover:bg-orange-600" : ""}>
          {hasChanges ? "Resubmit" : "Submit"} Widget
        </Button>
      </DialogFooter>
    </form>
  );
};

export default SubmissionForm;
