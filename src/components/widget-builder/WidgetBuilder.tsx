
import React, { useState } from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import ComponentEditor from './ComponentEditor';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from 'react-beautiful-dnd';
import { Card } from '@/components/ui/card';
import TooltipSelector from './TooltipSelector';

interface WidgetBuilderProps {
  components: WidgetComponent[];
  apis: ApiConfig[];
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onReorderComponents: (reorderedComponents: WidgetComponent[]) => void;
  onRequestApiTemplate: (componentId: string) => void;
  onApplyTooltip: (componentId: string, tooltipId: string) => void;
}

const WidgetBuilder: React.FC<WidgetBuilderProps> = ({
  components,
  apis,
  onUpdateComponent,
  onRemoveComponent,
  onReorderComponents,
  onRequestApiTemplate,
  onApplyTooltip
}) => {
  const [expandedComponentId, setExpandedComponentId] = useState<string | null>(null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onReorderComponents(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="widget-components">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {components.length === 0 && (
              <Card className="p-8 text-center bg-white border-dashed border-2 border-gray-300">
                <p className="text-gray-500">Add components to your widget from the left panel</p>
              </Card>
            )}
            
            {components.map((component, index) => (
              <Draggable key={component.id} draggableId={component.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="relative"
                  >
                    <Card className="bg-white border shadow-sm">
                      <div className="absolute top-2 right-2 z-10">
                        <TooltipSelector 
                          onSelectTooltip={(tooltipId) => onApplyTooltip(component.id, tooltipId)}
                          selectedTooltipId={component.tooltipId}
                        />
                      </div>
                      <ComponentEditor
                        component={component}
                        apis={apis}
                        isExpanded={expandedComponentId === component.id}
                        onToggleExpand={() => 
                          setExpandedComponentId(
                            expandedComponentId === component.id ? null : component.id
                          )
                        }
                        onUpdateComponent={onUpdateComponent}
                        onRemoveComponent={onRemoveComponent}
                        onRequestApiTemplate={() => onRequestApiTemplate(component.id)}
                      />
                    </Card>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default WidgetBuilder;
