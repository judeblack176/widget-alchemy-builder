
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle, Trash2, Plus, Tag as TagIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { COMMON_TOOLTIP_TAGS } from '@/types/widget-types';
import { Link } from 'react-router-dom';

export interface Tooltip {
  id: string;
  title: string;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  tags?: string[];
}

interface TooltipManagerProps {
  tooltips: Tooltip[];
  onAddTooltip: (tooltip: Tooltip) => void;
  onUpdateTooltip: (tooltipId: string, updatedTooltip: Tooltip) => void;
  onRemoveTooltip: (tooltipId: string) => void;
}

const TooltipManager: React.FC<TooltipManagerProps> = ({
  tooltips,
  onAddTooltip,
  onUpdateTooltip,
  onRemoveTooltip
}) => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [position, setPosition] = useState<'top' | 'right' | 'bottom' | 'left'>('right');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  // Load tags from localStorage or use default common tags
  const [availableTags, setAvailableTags] = useState<string[]>(() => {
    try {
      const savedTags = localStorage.getItem('savedTags');
      return savedTags ? JSON.parse(savedTags) : COMMON_TOOLTIP_TAGS;
    } catch (e) {
      return COMMON_TOOLTIP_TAGS;
    }
  });

  const handleAddTooltip = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive"
      });
      return;
    }

    const newTooltip: Tooltip = {
      id: editingId || `tooltip-${Date.now()}`,
      title,
      content,
      position,
      tags: selectedTags
    };

    if (editingId) {
      onUpdateTooltip(editingId, newTooltip);
      toast({
        title: "Success",
        description: "Tooltip has been updated"
      });
    } else {
      onAddTooltip(newTooltip);
      toast({
        title: "Success",
        description: "New tooltip has been added"
      });
    }

    resetForm();
  };

  const handleEditTooltip = (tooltip: Tooltip) => {
    setTitle(tooltip.title);
    setContent(tooltip.content);
    setPosition(tooltip.position || 'right');
    setSelectedTags(tooltip.tags || []);
    setEditingId(tooltip.id);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setPosition('right');
    setSelectedTags([]);
    setEditingId(null);
  };

  const filteredTooltips = tooltips.filter(tooltip => 
    tooltip.title.toLowerCase().includes(filter.toLowerCase()) ||
    tooltip.content.toLowerCase().includes(filter.toLowerCase()) ||
    (tooltip.tags && tooltip.tags.some(tag => 
      tag.toLowerCase().includes(filter.toLowerCase())
    ))
  );

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h3 className="font-medium text-gray-700">Tooltips</h3>
          <Badge className="ml-2">{tooltips.length}</Badge>
        </div>
        <div className="flex space-x-2">
          <Link to="/tags">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <TagIcon size={14} />
              Tags
            </Button>
          </Link>
          <Button 
            onClick={resetForm} 
            variant="default" 
            size="sm"
            className="bg-widget-blue hover:bg-blue-600 transition-colors flex items-center gap-1.5"
          >
            <Plus size={14} />
            Add Tooltip
          </Button>
        </div>
      </div>

      <Card className={editingId ? "border-blue-500" : ""}>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">
            {editingId ? "Edit Tooltip" : "Create Tooltip"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Tooltip title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Tooltip content"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Select
              value={position}
              onValueChange={value => setPosition(value as 'top' | 'right' | 'bottom' | 'left')}
            >
              <SelectTrigger id="position">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="bottom">Bottom</SelectItem>
                <SelectItem value="left">Left</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 py-2">
              {availableTags.map((tag, index) => (
                <Badge
                  key={index}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer",
                    selectedTags.includes(tag) ? "bg-blue-500 hover:bg-blue-400" : "hover:bg-gray-100"
                  )}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex justify-end pt-2">
            {editingId && (
              <Button 
                variant="outline" 
                className="mr-2" 
                onClick={resetForm}
              >
                Cancel
              </Button>
            )}
            <Button 
              onClick={handleAddTooltip} 
              className="bg-widget-blue hover:bg-blue-600 transition-colors"
            >
              {editingId ? "Update" : "Add"} Tooltip
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Input
          placeholder="Filter tooltips..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <ScrollArea className="h-[400px] pr-4">
          {filteredTooltips.length === 0 ? (
            <div className="text-center py-8">
              <HelpCircle className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-500">No tooltips found</p>
              <p className="text-sm text-gray-400 mt-1">
                {filter ? "Try a different filter or create a new tooltip" : "Create a tooltip to get started"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTooltips.map(tooltip => (
                <Card key={tooltip.id} className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{tooltip.title}</h4>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTooltip(tooltip)}
                          className="h-8 w-8 text-gray-500 hover:text-gray-700"
                        >
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                            <path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveTooltip(tooltip.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{tooltip.content}</p>
                    {tooltip.tags && tooltip.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tooltip.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default TooltipManager;
