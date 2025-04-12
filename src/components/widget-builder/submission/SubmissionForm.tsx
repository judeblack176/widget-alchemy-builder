
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";

interface SubmissionFormProps {
  formData: {
    name: string;
    description: string;
    category: string;
    tags: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    category: string;
    tags: string;
  }>>;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing?: boolean;
  hasChanges?: boolean;
  onCancelEditing?: () => void;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isEditing,
  hasChanges,
  onCancelEditing,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4 py-4">
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
        {isEditing && (
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
