
import { useCallback } from 'react';
import { WidgetComponent } from '@/types/widget-types';

interface UseDragAndDropProps {
  onAddComponent: (type: string | WidgetComponent) => void;
}

export const useDragAndDrop = ({ onAddComponent }: UseDragAndDropProps) => {
  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return;
    
    if (result.source.droppableId === 'component-library' && result.destination.droppableId === 'widget-builder') {
      const componentType = result.draggableId;
      const componentLibraryItem = document.querySelector(`[data-component-type="${componentType}"]`);
      
      if (componentLibraryItem && componentLibraryItem instanceof HTMLElement) {
        componentLibraryItem.click();
      }
    }
  }, [onAddComponent]);

  return { handleDragEnd };
};
