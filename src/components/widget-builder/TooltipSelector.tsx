
import React, { useState, useEffect } from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

// Define the Tooltip interface if it's not already defined elsewhere
interface Tooltip {
  id: string;
  title: string;
  content: string;
  type?: "info" | "warning" | "success" | "error";
  createdAt: string;
}

interface TooltipSelectorProps {
  onSelectTooltip: (tooltipId: string) => void;
  selectedTooltipId?: string;
}

const TooltipSelector: React.FC<TooltipSelectorProps> = ({ 
  onSelectTooltip,
  selectedTooltipId 
}) => {
  const { toast } = useToast();
  const [tooltips, setTooltips] = useState<Tooltip[]>([]);
  const [open, setOpen] = useState(false);

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
  }, [open]); // Reload when dropdown opens

  const handleSelect = (tooltipId: string) => {
    onSelectTooltip(tooltipId);
    setOpen(false);
    
    const selectedTooltip = tooltips.find(t => t.id === tooltipId);
    toast({
      title: "Tooltip Applied",
      description: `Applied tooltip: ${selectedTooltip?.title || 'Unknown'}`
    });
  };

  const handleRemove = () => {
    onSelectTooltip('');
    setOpen(false);
    toast({
      title: "Tooltip Removed",
      description: "Tooltip has been removed from this field."
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-6 w-6 ${selectedTooltipId ? 'text-blue-500' : ''}`}
        >
          <Info size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {tooltips.length === 0 ? (
          <div className="text-center py-4 px-2">
            <p className="text-sm text-gray-500">No tooltips available</p>
            <p className="text-xs text-gray-400 mt-1">
              Create tooltips in the Tooltip Manager
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[200px]">
            {tooltips.map((tooltip) => (
              <DropdownMenuItem 
                key={tooltip.id}
                className={`${selectedTooltipId === tooltip.id ? 'bg-blue-50' : ''}`}
                onClick={() => handleSelect(tooltip.id)}
              >
                <div className="truncate">
                  <div className="font-medium text-sm truncate">{tooltip.title}</div>
                  <div className="text-xs text-gray-500 truncate">{tooltip.content}</div>
                </div>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}
        
        {selectedTooltipId && (
          <DropdownMenuItem 
            className="text-red-500 font-medium border-t mt-1 pt-1"
            onClick={handleRemove}
          >
            Remove Tooltip
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TooltipSelector;
