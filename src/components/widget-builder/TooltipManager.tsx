import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Plus, ListPlus, ArrowRight, Edit, Trash2 } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Tooltip } from '@radix-ui/react-tooltip';

export interface TooltipTemplate {
  id: string;
  name: string;
  content: string;
  placement: "top" | "right" | "bottom" | "left";
  backgroundColor: string;
  textColor: string;
  showArrow: boolean;
  triggerStyle: "button" | "text" | "icon" | "custom";
}

interface TooltipManagerProps {
  tooltipTemplates: TooltipTemplate[];
  selectedComponentId: string | null;
  onAddTooltip: (template: Partial<TooltipTemplate>) => void;
  onApplyTooltip: (template: TooltipTemplate) => void;
  onDeleteTooltip: (templateId: string) => void;
}

const TooltipManager: React.FC<TooltipManagerProps> = ({
  tooltipTemplates,
  selectedComponentId,
  onAddTooltip,
  onApplyTooltip,
  onDeleteTooltip
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTooltip, setNewTooltip] = useState<Partial<TooltipTemplate>>({
    name: '',
    content: '',
    placement: 'top',
    backgroundColor: '#1E293B',
    textColor: '#FFFFFF',
    showArrow: true,
    triggerStyle: 'button'
  });

  const handleAddTooltip = () => {
    onAddTooltip(newTooltip);
    setNewTooltip({
      name: '',
      content: '',
      placement: 'top',
      backgroundColor: '#1E293B',
      textColor: '#FFFFFF',
      showArrow: true,
      triggerStyle: 'button'
    });
    setIsAddDialogOpen(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Tooltip Manager</span>
          <Button variant="outline" size="sm" onClick={() => setIsAddDialogOpen(true)}>
            <Plus size={16} className="mr-1" /> New Tooltip
          </Button>
        </CardTitle>
        <CardDescription>
          Create and manage tooltips that can be applied to any component
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tooltipTemplates.length === 0 ? (
          <div className="py-8 text-center">
            <ListPlus className="h-10 w-10 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No tooltips created yet</p>
            <Button 
              variant="ghost" 
              className="mt-4"
              onClick={() => setIsAddDialogOpen(true)}
            >
              Create your first tooltip
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {tooltipTemplates.map((tooltip) => (
                <TooltipListItem 
                  key={tooltip.id}
                  tooltip={tooltip}
                  isComponentSelected={!!selectedComponentId}
                  onApply={() => onApplyTooltip(tooltip)}
                  onDelete={() => onDeleteTooltip(tooltip.id)}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Tooltip</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tooltip-name">Template Name</Label>
              <Input 
                id="tooltip-name" 
                value={newTooltip.name} 
                onChange={(e) => setNewTooltip({...newTooltip, name: e.target.value})}
                placeholder="e.g., Info Tooltip"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tooltip-content">Content</Label>
              <Input 
                id="tooltip-content" 
                value={newTooltip.content} 
                onChange={(e) => setNewTooltip({...newTooltip, content: e.target.value})}
                placeholder="Tooltip text content"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tooltip-placement">Placement</Label>
              <select 
                id="tooltip-placement"
                className="w-full p-2 border rounded-md"
                value={newTooltip.placement}
                onChange={(e) => setNewTooltip({
                  ...newTooltip, 
                  placement: e.target.value as "top" | "right" | "bottom" | "left"
                })}
              >
                <option value="top">Top</option>
                <option value="right">Right</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tooltip-trigger">Trigger Style</Label>
              <select 
                id="tooltip-trigger"
                className="w-full p-2 border rounded-md"
                value={newTooltip.triggerStyle}
                onChange={(e) => setNewTooltip({
                  ...newTooltip, 
                  triggerStyle: e.target.value as "button" | "text" | "icon" | "custom"
                })}
              >
                <option value="button">Button</option>
                <option value="text">Text</option>
                <option value="icon">Icon</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tooltip-bg">Background Color</Label>
                <div className="flex gap-2">
                  <Input 
                    id="tooltip-bg" 
                    type="color"
                    value={newTooltip.backgroundColor}
                    onChange={(e) => setNewTooltip({
                      ...newTooltip, 
                      backgroundColor: e.target.value
                    })}
                    className="w-10 h-10 p-1"
                  />
                  <Input 
                    type="text"
                    value={newTooltip.backgroundColor}
                    onChange={(e) => setNewTooltip({
                      ...newTooltip, 
                      backgroundColor: e.target.value
                    })}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tooltip-text">Text Color</Label>
                <div className="flex gap-2">
                  <Input 
                    id="tooltip-text" 
                    type="color"
                    value={newTooltip.textColor}
                    onChange={(e) => setNewTooltip({
                      ...newTooltip, 
                      textColor: e.target.value
                    })}
                    className="w-10 h-10 p-1"
                  />
                  <Input 
                    type="text"
                    value={newTooltip.textColor}
                    onChange={(e) => setNewTooltip({
                      ...newTooltip, 
                      textColor: e.target.value
                    })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="show-arrow"
                checked={newTooltip.showArrow}
                onChange={(e) => setNewTooltip({
                  ...newTooltip,
                  showArrow: e.target.checked
                })}
              />
              <Label htmlFor="show-arrow">Show Arrow</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddTooltip}
              disabled={!newTooltip.name || !newTooltip.content}
            >
              Save Tooltip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// List item component to keep the main component clean
const TooltipListItem: React.FC<{
  tooltip: TooltipTemplate;
  isComponentSelected: boolean;
  onApply: () => void;
  onDelete: () => void;
}> = ({ tooltip, isComponentSelected, onApply, onDelete }) => {
  return (
    <div className="flex items-center justify-between border rounded-md p-3 bg-white hover:border-gray-400 transition-colors">
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="flex-grow cursor-pointer">
            <h4 className="font-medium">{tooltip.name}</h4>
            <p className="text-sm text-gray-500 truncate max-w-[200px]">{tooltip.content}</p>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <div>
              <h4 className="font-semibold text-sm">Content</h4>
              <p className="text-sm">{tooltip.content}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-semibold">Placement: </span>
                {tooltip.placement}
              </div>
              <div>
                <span className="font-semibold">Trigger: </span>
                {tooltip.triggerStyle}
              </div>
              <div>
                <span className="font-semibold">Background: </span>
                <span className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: tooltip.backgroundColor }}
                  />
                  {tooltip.backgroundColor}
                </span>
              </div>
              <div>
                <span className="font-semibold">Text: </span>
                <span className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: tooltip.textColor }}
                  />
                  {tooltip.textColor}
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

      <div className="flex gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8"
          onClick={onApply}
          disabled={!isComponentSelected}
          title={isComponentSelected ? "Apply to selected component" : "Select a component first"}
        >
          <ArrowRight size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-red-600 hover:text-red-800"
          onClick={onDelete}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default TooltipManager;
