
import React from 'react';
import { useWidget } from '@/contexts/WidgetContext';
import { DragDropContext } from 'react-beautiful-dnd';

interface DragDropHandlerProps {
  children: React.ReactNode;
}

const DragDropHandler: React.FC<DragDropHandlerProps> = ({ children }) => {
  const { handleAddComponent } = useWidget();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    if (result.source.droppableId === 'component-library' && result.destination.droppableId === 'widget-builder') {
      const componentType = result.draggableId;
      const componentLibraryItem = document.querySelector(`[data-component-type="${componentType}"]`);
      
      if (componentLibraryItem && componentLibraryItem instanceof HTMLElement) {
        componentLibraryItem.click();
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {children}
    </DragDropContext>
  );
};

export default DragDropHandler;
