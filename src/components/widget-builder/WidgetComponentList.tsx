
import React from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import ComponentEditor from './ComponentEditor';
import { Card } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Tooltip } from './TooltipManager';

interface WidgetComponentListProps {
  components: WidgetComponent[];
  apis: ApiConfig[];
  expandedComponentId: string | null;
  onToggleExpand: (componentId: string) => void;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onRequestApiTemplate: (componentId: string) => void;
  onApplyTooltip?: (componentId: string, tooltipId: string) => void;
  customTooltips?: Tooltip[];
  onDragEnd: (result: any) => void;
}

const WidgetComponentList: React.FC<WidgetComponentListProps> = ({
  components,
  apis,
  expandedComponentId,
  onToggleExpand,
  onUpdateComponent,
  onRemoveComponent,
  onRequestApiTemplate,
  onApplyTooltip,
  customTooltips = [],
  onDragEnd
}) => {
  const headerComponent = components.find(c => c.type === 'header');
  const alertComponents = components.filter(c => c.type === 'alert');
  const regularComponents = components.filter(c => c.type !== 'header' && c.type !== 'alert');

  return (
    <div className="space-y-4">
      {/* Fixed header component section */}
      {headerComponent && (
        <Card className="bg-white border border-blue-500 shadow-sm">
          <ComponentEditor
            component={headerComponent}
            apis={apis}
            isExpanded={expandedComponentId === headerComponent.id}
            onToggleExpand={() => onToggleExpand(headerComponent.id)}
            onUpdateComponent={onUpdateComponent}
            onRemoveComponent={onRemoveComponent}
            onRequestApiTemplate={() => onRequestApiTemplate(headerComponent.id)}
            onApplyTooltip={onApplyTooltip ? 
              (tooltipId: string) => onApplyTooltip(headerComponent.id, tooltipId) : 
              undefined}
            disableRemove={true}
            customTooltips={customTooltips}
          />
        </Card>
      )}
      
      {/* Fixed alert section */}
      {alertComponents.length > 0 && (
        <div className="space-y-4">
          {alertComponents.map((alertComponent) => (
            <Card key={alertComponent.id} className="bg-white border border-amber-500 shadow-sm">
              <ComponentEditor
                component={alertComponent}
                apis={apis}
                isExpanded={expandedComponentId === alertComponent.id}
                onToggleExpand={() => onToggleExpand(alertComponent.id)}
                onUpdateComponent={onUpdateComponent}
                onRemoveComponent={onRemoveComponent}
                onRequestApiTemplate={() => onRequestApiTemplate(alertComponent.id)}
                onApplyTooltip={onApplyTooltip ? 
                  (tooltipId: string) => onApplyTooltip(alertComponent.id, tooltipId) : 
                  undefined}
                customTooltips={customTooltips}
              />
            </Card>
          ))}
        </div>
      )}

      {/* Regular components with drag and drop */}
      {regularComponents.length > 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="components">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4 pr-2"
              >
                {regularComponents.map((component, index) => (
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
                        <Card className="bg-white border shadow-sm">
                          <ComponentEditor
                            component={component}
                            apis={apis}
                            isExpanded={expandedComponentId === component.id}
                            onToggleExpand={() => onToggleExpand(component.id)}
                            onUpdateComponent={onUpdateComponent}
                            onRemoveComponent={onRemoveComponent}
                            onRequestApiTemplate={() => onRequestApiTemplate(component.id)}
                            onApplyTooltip={onApplyTooltip ? 
                              (tooltipId: string) => onApplyTooltip(component.id, tooltipId) : 
                              undefined}
                            customTooltips={customTooltips}
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
      )}
    </div>
  );
};

export default WidgetComponentList;
