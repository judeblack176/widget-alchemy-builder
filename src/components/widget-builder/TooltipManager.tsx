
import React, { useState, useRef } from 'react';
import { Plus, Edit, Trash2, Upload, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImportDialogOpen = () => {
    setIsImportDialogOpen(true);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const importedTooltips = parseCSVorExcel(csvData);
        
        if (importedTooltips.length === 0) {
          toast({
            title: "Import Failed",
            description: "No valid tooltips found in the file.",
            variant: "destructive"
          });
          return;
        }

        importedTooltips.forEach(tooltip => {
          onAddTooltip({
            id: `tooltip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: tooltip.title,
            content: tooltip.content
          });
        });

        toast({
          title: "Import Successful",
          description: `${importedTooltips.length} tooltips imported.`
        });
        setIsImportDialogOpen(false);
      } catch (error) {
        console.error("Error parsing file:", error);
        toast({
          title: "Import Failed",
          description: "There was an error processing the file. Please check the format.",
          variant: "destructive"
        });
      }
    };

    reader.readAsText(file);
    // Reset file input so the same file can be selected again
    e.target.value = '';
  };

  const parseCSVorExcel = (data: string): { title: string; content: string }[] => {
    const result: { title: string; content: string }[] = [];
    
    // Split by newlines and filter out empty lines
    const lines = data.split(/\r?\n/).filter(line => line.trim().length > 0);
    
    if (lines.length === 0) return result;
    
    // Skip header row if it exists
    const startIdx = lines[0].toLowerCase().includes('title') && 
                     lines[0].toLowerCase().includes('content') ? 1 : 0;
    
    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i];
      
      // Try to split by comma first (CSV format)
      let parts = line.split(',');
      
      // If we don't have at least 2 parts, try tab delimiter (Excel export format)
      if (parts.length < 2) {
        parts = line.split('\t');
      }
      
      if (parts.length >= 2) {
        const title = parts[0].trim();
        // Join remaining parts as content in case content contains commas
        const content = parts.slice(1).join(',').trim();
        
        if (title && content) {
          result.push({ title, content });
        }
      }
    }
    
    return result;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tooltips</h3>
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={handleImportDialogOpen}
                >
                  <Upload size={16} />
                  Import
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Import tooltips from CSV or Excel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
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

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Import Tooltips</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <FileSpreadsheet size={48} className="text-gray-400" />
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">
                  Import tooltips from CSV or Excel files
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  File should have columns for Title and Content
                </p>
              </div>
              <Button 
                onClick={handleFileSelect} 
                className="flex items-center gap-2"
              >
                <Upload size={16} />
                Select File
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv,.xls,.xlsx,.txt"
                style={{ display: 'none' }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TooltipManager;
