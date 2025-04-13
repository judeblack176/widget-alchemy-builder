
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';

interface ActionButtonsProps {
  componentId: string;
  onRemoveComponent: (componentId: string) => void;
  disableRemove: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  componentId,
  onRemoveComponent,
  disableRemove
}) => {
  return (
    <div className="flex justify-end space-x-2 border-t pt-4 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onRemoveComponent(componentId)}
        disabled={disableRemove}
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 size={14} className="mr-1" />
        Remove
      </Button>
    </div>
  );
};

export default ActionButtons;
