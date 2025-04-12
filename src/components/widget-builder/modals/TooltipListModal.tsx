
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HelpCircle } from 'lucide-react';
import { Tooltip } from "@/components/widget-builder/TooltipManager";

interface TooltipListModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tooltips: Tooltip[];
}

const TooltipListModal: React.FC<TooltipListModalProps> = ({
  isOpen,
  onOpenChange,
  tooltips
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Available Tooltips</DialogTitle>
        </DialogHeader>
        
        {tooltips.length === 0 ? (
          <div className="text-center py-8">
            <HelpCircle className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-gray-500">No tooltips created yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Create tooltips from the Tooltips tab to use them in your components
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-1 gap-4 p-1">
              {tooltips.map((tooltip) => (
                <Card key={tooltip.id} className="overflow-hidden">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-base font-medium">{tooltip.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-4">
                    <p className="text-sm">{tooltip.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TooltipListModal;
