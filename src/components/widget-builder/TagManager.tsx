
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Edit, Plus, Save, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { COMMON_TOOLTIP_TAGS } from "@/types/widget-types";

interface TagManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TagManager = ({ open, onOpenChange }: TagManagerProps) => {
  const { toast } = useToast();
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [editingTag, setEditingTag] = useState<{ index: number; value: string } | null>(null);

  // Load tags from localStorage
  useEffect(() => {
    const loadTags = () => {
      try {
        const savedTags = localStorage.getItem("widgetTags");
        if (savedTags) {
          setTags(JSON.parse(savedTags));
        } else {
          // Initialize with common tags if no saved tags
          setTags([...COMMON_TOOLTIP_TAGS]);
          localStorage.setItem("widgetTags", JSON.stringify(COMMON_TOOLTIP_TAGS));
        }
      } catch (error) {
        console.error("Failed to load tags", error);
        setTags([]);
      }
    };

    if (open) {
      loadTags();
    }
  }, [open]);

  // Save tags to localStorage
  const saveTags = (updatedTags: string[]) => {
    try {
      localStorage.setItem("widgetTags", JSON.stringify(updatedTags));
    } catch (error) {
      console.error("Failed to save tags", error);
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    // Check if tag already exists
    if (tags.includes(newTag.trim())) {
      toast({
        title: "Tag already exists",
        description: `The tag "${newTag}" already exists.`,
        variant: "destructive",
      });
      return;
    }
    
    const updatedTags = [...tags, newTag.trim()];
    setTags(updatedTags);
    saveTags(updatedTags);
    setNewTag("");
    
    toast({
      title: "Tag Added",
      description: `Successfully added tag "${newTag}".`,
    });
  };

  const handleRemoveTag = (index: number) => {
    const tagToRemove = tags[index];
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
    saveTags(updatedTags);
    
    toast({
      title: "Tag Removed",
      description: `Successfully removed tag "${tagToRemove}".`,
    });
  };

  const startEditTag = (index: number) => {
    setEditingTag({ index, value: tags[index] });
  };

  const handleEditTag = () => {
    if (!editingTag) return;
    
    const { index, value } = editingTag;
    
    // Check if edited tag already exists
    if (tags.includes(value.trim()) && tags[index] !== value.trim()) {
      toast({
        title: "Tag already exists",
        description: `The tag "${value}" already exists.`,
        variant: "destructive",
      });
      return;
    }
    
    const updatedTags = [...tags];
    updatedTags[index] = value.trim();
    setTags(updatedTags);
    saveTags(updatedTags);
    setEditingTag(null);
    
    toast({
      title: "Tag Updated",
      description: `Successfully updated tag.`,
    });
  };

  const resetToDefaultTags = () => {
    setTags([...COMMON_TOOLTIP_TAGS]);
    saveTags([...COMMON_TOOLTIP_TAGS]);
    
    toast({
      title: "Tags Reset",
      description: "Tags have been reset to default values.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Manage Tags</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add new tag..."
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <Button onClick={handleAddTag} size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          
          <div className="mt-2 max-h-[300px] overflow-y-auto border rounded-md p-3">
            {tags.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No tags available</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <div key={index} className="flex items-center">
                    {editingTag && editingTag.index === index ? (
                      <div className="flex border rounded-md">
                        <Input
                          value={editingTag.value}
                          onChange={(e) => setEditingTag({ ...editingTag, value: e.target.value })}
                          className="h-8 rounded-r-none border-none"
                          onKeyDown={(e) => e.key === 'Enter' && handleEditTag()}
                          autoFocus
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 rounded-l-none"
                          onClick={handleEditTag}
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <Badge className="px-2 py-1 gap-1 h-8">
                        {tag}
                        <button 
                          onClick={() => startEditTag(index)} 
                          className="ml-1 p-1 rounded-full hover:bg-primary/20"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button 
                          onClick={() => handleRemoveTag(index)} 
                          className="p-1 rounded-full hover:bg-primary/20"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button 
            variant="outline" 
            onClick={resetToDefaultTags}
            size="sm"
            className="gap-1"
          >
            <Trash2 className="h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TagManager;
