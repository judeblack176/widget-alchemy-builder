
import React from 'react';
import { Card } from '@/components/ui/card';

interface EmptyStateMessageProps {
  message: string;
}

const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({ message }) => {
  return (
    <Card className="p-8 text-center bg-white border-dashed border-2 border-gray-300">
      <p className="text-gray-500">{message}</p>
    </Card>
  );
};

export default EmptyStateMessage;
