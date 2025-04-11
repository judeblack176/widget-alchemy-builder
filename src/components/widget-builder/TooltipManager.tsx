
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export interface Tooltip {
  id: string;
  title: string;
  content: string;
}

interface TooltipManagerProps {
  onClose: () => void;
  open: boolean;
}

const TooltipManager: React.FC<TooltipManagerProps> = ({ onClose, open }) => {
  const { toast } = useToast();
  const [tooltips, setTooltips] = useState<Tooltip[]>([]);
  const [editingTooltip, setEditingTooltip] = useState<Tooltip | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    // Load tooltips from localStorage
    const savedTooltips = localStorage.getItem('savedTooltips');
    if (savedTooltips) {
      try {
        setTooltips(JSON.parse(savedTooltips));
      } catch (error) {
        console.error("Failed to load tooltips", error);
      }
    }
  }, []);

  const saveTooltips = (updatedTooltips: Tooltip[]) => {
    localStorage.setItem('savedTooltips', JSON.stringify(updatedTooltips));
    setTooltips(updatedTooltips);
  };

  const handleAddTooltip = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive"
      });
      return;
    }

    const newTooltips = [...tooltips];
    
    if (editingTooltip) {
      // Edit existing tooltip
      const index = newTooltips.findIndex(t => t.id === editingTooltip.id);
      if (index !== -1) {
        newTooltips[index] = {
          id: editingTooltip.id,
          title,
          content
        };
      }
      setEditingTooltip(null);
    } else {
      // Add new tooltip
      newTooltips.push({
        id: `tooltip-${Date.now()}`,
        title,
        content
      });
    }

    saveTooltips(newTooltips);
    setTitle('');
    setContent('');

    toast({
      title: editingTooltip ? "Tooltip Updated" : "Tooltip Added",
      description: editingTooltip ? 
        `The tooltip "${title}" has been updated.` : 
        `New tooltip "${title}" has been added.`
    });
  };

  const handleEditTooltip = (tooltip: Tooltip) => {
    setEditingTooltip(tooltip);
    setTitle(tooltip.title);
    setContent(tooltip.content);
  };

  const handleDeleteTooltip = (tooltipId: string) => {
    const newTooltips = tooltips.filter(t => t.id !== tooltipId);
    saveTooltips(newTooltips);
    
    // If we're editing the tooltip that was deleted, clear the form
    if (editingTooltip && editingTooltip.id === tooltipId) {
      setEditingTooltip(null);
      setTitle('');
      setContent('');
    }

    toast({
      title: "Tooltip Deleted",
      description: "The tooltip has been removed."
    });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Tooltip Manager</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Tooltip title"
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  placeholder="Tooltip content"
                  rows={4}
                />
              </div>
              <Button onClick={handleAddTooltip} className="w-full">
                {editingTooltip ? 'Update Tooltip' : 'Add Tooltip'}
              </Button>
              {editingTooltip && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditingTooltip(null);
                    setTitle('');
                    setContent('');
                  }} 
                  className="w-full"
                >
                  Cancel Editing
                </Button>
              )}
            </div>
          </div>
          
          <div>
            <ScrollArea className="h-[300px] pr-4">
              {tooltips.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No tooltips created yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Create your first tooltip using the form
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tooltips.map((tooltip) => (
                    <Card key={tooltip.id} className="bg-gray-50">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-sm flex justify-between items-center">
                          <span>{tooltip.title}</span>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6" 
                              onClick={() => handleEditTooltip(tooltip)}
                            >
                              <Edit size={14} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-red-500" 
                              onClick={() => handleDeleteTooltip(tooltip.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <p className="text-xs">{tooltip.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TooltipManager;
