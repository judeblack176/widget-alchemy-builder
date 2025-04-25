
import React from 'react';
import EmptyStateMessage from '../EmptyStateMessage';

interface EmptyStateHandlerProps {
  filteredComponents: any[];
  searchQuery: string;
}

const EmptyStateHandler: React.FC<EmptyStateHandlerProps> = ({
  filteredComponents,
  searchQuery
}) => {
  if (filteredComponents.length === 0 && searchQuery.trim() !== '') {
    return <EmptyStateMessage message="No components match your search" />;
  }
  
  if (filteredComponents.length === 0) {
    return <EmptyStateMessage message="Add components to your widget from the left panel" />;
  }
  
  return null;
};

export default EmptyStateHandler;
