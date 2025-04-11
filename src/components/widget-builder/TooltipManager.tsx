
import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

export interface Tooltip {
  id: string;
  title: string;
  content: string;
}

interface TooltipManagerProps {
  tooltips: Tooltip[];
  onAddTooltip: (tooltip: Tooltip) => void;
  onUpdateTooltip: (tooltipId: string, tooltip: Tooltip) => void;
  onRemoveTooltip: (tooltipId: string) => void;
}

const TooltipManager: React.FC<TooltipManagerProps> = ({
  tooltips,
  onAddTooltip,
  onUpdateTooltip,
  onRemoveTooltip
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [currentTooltip, setCurrentTooltip] = useState<Tooltip | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleAddNewTooltip = () => {
    setCurrentTooltip(null);
    setTitle('');
    setContent('');
    setIsEditing(true);
  };

  const handleEditTooltip = (tooltip: Tooltip) => {
    setCurrentTooltip(tooltip);
    setTitle(tooltip.title);
    setContent(tooltip.content);
    setIsEditing(true);
  };

  const handleSaveTooltip = () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please provide a title for the tooltip.",
        variant: "destructive"
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please provide content for the tooltip.",
        variant: "destructive"
      });
      return;
    }

    const tooltipData: Tooltip = {
      id: currentTooltip?.id || `tooltip-${Date.now()}`,
      title,
      content
    };

    if (currentTooltip) {
      onUpdateTooltip(currentTooltip.id, tooltipData);
      toast({
        title: "Tooltip Updated",
        description: `Tooltip "${title}" has been updated.`
      });
    } else {
      onAddTooltip(tooltipData);
      toast({
        title: "Tooltip Added",
        description: `Tooltip "${title}" has been added.`
      });
    }

    setIsEditing(false);
    setCurrentTooltip(null);
    setTitle('');
    setContent('');
  };

  const handleRemoveTooltip = (tooltipId: string, tooltipTitle: string) => {
    onRemoveTooltip(tooltipId);
    toast({
      title: "Tooltip Removed",
      description: `Tooltip "${tooltipTitle}" has been removed.`
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tooltips</h3>
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={handleAddNewTooltip}
        >
          <Plus size={16} />
          Add Tooltip
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-240px)]">
        {tooltips.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p>No tooltips created yet</p>
            <p className="text-sm mt-1">Create tooltips to provide additional information to users</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tooltips.map((tooltip) => (
              <Card key={tooltip.id} className="overflow-hidden">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base font-medium">{tooltip.title}</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <p className="text-sm line-clamp-2">{tooltip.content}</p>
                </CardContent>
                <CardFooter className="py-2 px-4 flex justify-end gap-2 border-t">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditTooltip(tooltip)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveTooltip(tooltip.id, tooltip.title)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentTooltip ? 'Edit Tooltip' : 'Add New Tooltip'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter tooltip title"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter tooltip content"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTooltip}>
              {currentTooltip ? 'Update' : 'Add'} Tooltip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TooltipManager;
