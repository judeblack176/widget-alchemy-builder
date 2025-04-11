
import React, { useState } from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import ComponentEditor from './ComponentEditor';
import { Card } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import SearchBar from './SearchBar';

interface WidgetBuilderProps {
  components: WidgetComponent[];
  apis: ApiConfig[];
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onReorderComponents: (reorderedComponents: WidgetComponent[]) => void;
  onRequestApiTemplate: (componentId: string) => void;
  onApplyTooltip?: (componentId: string, tooltipId: string) => void;
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
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const items = Array.from(components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorderComponents(items);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredComponents = components.filter(component => {
    // If no search query, show all components
    if (!searchQuery.trim()) return true;
    
    // Search in component type
    if (component.type.toLowerCase().includes(searchQuery.toLowerCase())) {
      return true;
    }
    
    // Search in component props if they're strings
    for (const key in component.props) {
      if (
        typeof component.props[key] === 'string' && 
        component.props[key].toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return true;
      }
    }
    
    return false;
  });

  return (
    <div className="space-y-4">
      <SearchBar onSearch={handleSearch} placeholder="Search components..." />
      
      {filteredComponents.length === 0 && searchQuery.trim() !== '' ? (
        <Card className="p-8 text-center bg-white border-dashed border-2 border-gray-300">
          <p className="text-gray-500">No components match your search</p>
        </Card>
      ) : filteredComponents.length === 0 ? (
        <Card className="p-8 text-center bg-white border-dashed border-2 border-gray-300">
          <p className="text-gray-500">Add components to your widget from the left panel</p>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="components">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {filteredComponents.map((component, index) => (
                  <Draggable key={component.id} draggableId={component.id} index={index}>
                    {(provided) => (
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
                            onToggleExpand={() => 
                              setExpandedComponentId(
                                expandedComponentId === component.id ? null : component.id
                              )
                            }
                            onUpdateComponent={onUpdateComponent}
                            onRemoveComponent={onRemoveComponent}
                            onRequestApiTemplate={() => onRequestApiTemplate(component.id)}
                            onApplyTooltip={onApplyTooltip ? 
                              (tooltipId: string) => onApplyTooltip(component.id, tooltipId) : 
                              undefined}
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

export default WidgetBuilder;
