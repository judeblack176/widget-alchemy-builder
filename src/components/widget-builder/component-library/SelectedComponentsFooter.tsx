
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface SelectedComponentsFooterProps {
  selectedCount: number;
  onAddSelected: () => void;
}

const SelectedComponentsFooter: React.FC<SelectedComponentsFooterProps> = ({
  selectedCount,
  onAddSelected
}) => {
  return (
    <div className="flex-none mt-4 pt-4 border-t">
      <div className="flex items-center justify-between">
        <Label className="text-sm">
          {selectedCount} component{selectedCount > 1 ? 's' : ''} selected
        </Label>
        <Button onClick={onAddSelected}>
          Add Selected
        </Button>
      </div>
    </div>
  );
};

export default SelectedComponentsFooter;
