
import React from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ComponentEditor from '../component-editor';
import { Tooltip } from '../TooltipManager';

interface DraggableComponentsListProps {
  components: WidgetComponent[];
  expandedComponentId: string | null;
  setExpandedComponentId: (id: string | null) => void;
  apis: ApiConfig[];
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onRequestApiTemplate: (componentId: string) => void;
  onApplyTooltip?: (componentId: string, tooltipId: string) => void;
  tooltips?: Tooltip[];
  onDragEnd: (result: any) => void;
}

const DraggableComponentsList: React.FC<DraggableComponentsListProps> = ({
  components,
  expandedComponentId,
  setExpandedComponentId,
  apis,
  onUpdateComponent,
  onRemoveComponent,
  onRequestApiTemplate,
  onApplyTooltip,
  tooltips = [],
  onDragEnd
}) => {
  const cardStyle = "w-full bg-white border shadow-sm";

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="components">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4 pr-2"
          >
            {components.map((component, index) => (
              <Draggable 
                key={component.id} 
                draggableId={component.id} 
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="relative"
                  >
                    <Card className={cardStyle}>
                      <div className="relative w-full">
                        <div 
                          className="cursor-pointer" 
                          onClick={() => setExpandedComponentId(
                            expandedComponentId === component.id ? null : component.id
                          )}
                        >
                          <ComponentEditor
                            component={component}
                            apis={apis}
                            isExpanded={expandedComponentId === component.id}
                            onToggleExpand={() => {}}  // Empty function as we're handling this in the parent div
                            onUpdateComponent={onUpdateComponent}
                            onRemoveComponent={onRemoveComponent}
                            onRequestApiTemplate={() => onRequestApiTemplate(component.id)}
                            onApplyTooltip={onApplyTooltip ? 
                              (tooltipId: string) => onApplyTooltip(component.id, tooltipId) : 
                              undefined}
                            customTooltips={tooltips}
                            showActionButtons={false}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveComponent(component.id);
                          }}
                          className="absolute top-3 right-3 h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
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

export default DraggableComponentsList;
