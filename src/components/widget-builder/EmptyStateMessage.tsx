
import React from 'react';
import { Card } from '@/components/ui/card';

interface EmptyStateMessageProps {
  hasSearchQuery: boolean;
}

const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({ hasSearchQuery }) => {
  return (
    <Card className="p-8 text-center bg-white border-dashed border-2 border-gray-300">
      <p className="text-gray-500">
        {hasSearchQuery
          ? "No components match your search"
          : "Add components to your widget from the left panel"}
      </p>
    </Card>
  );
};

export default EmptyStateMessage;
