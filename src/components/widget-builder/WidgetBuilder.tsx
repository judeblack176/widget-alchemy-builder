
import React, { useState } from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import ComponentEditor from './ComponentEditor';
import { Card } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
  
  // Adjust MAX_COMPONENTS based on presence of alert components
  const alertComponents = components.filter(c => c.type === 'alert');
  const MAX_COMPONENTS = alertComponents.length > 0 ? 7 : 6;
  const atComponentLimit = components.length >= MAX_COMPONENTS;

  // Separate the header component from other components
  const headerComponent = components.find(c => c.type === 'header');
  const nonHeaderComponents = components.filter(c => c.type !== 'header');

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    // Copy only the non-header components for reordering
    const items = Array.from(nonHeaderComponents);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Combine with header component if it exists
    const reorderedComponents = headerComponent 
      ? [headerComponent, ...items] 
      : items;

    onReorderComponents(reorderedComponents);
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

  // Separate filtered components into header and non-header for rendering
  const filteredHeaderComponent = headerComponent && filteredComponents.includes(headerComponent) 
    ? headerComponent 
    : null;
  const filteredNonHeaderComponents = filteredComponents.filter(c => c.type !== 'header');

  return (
    <div className="space-y-4">
      {atComponentLimit && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Maximum of {MAX_COMPONENTS} components reached. Please remove a component before adding a new one.
          </AlertDescription>
        </Alert>
      )}
      
      {filteredComponents.length === 0 && searchQuery.trim() !== '' ? (
        <Card className="p-8 text-center bg-white border-dashed border-2 border-gray-300">
          <p className="text-gray-500">No components match your search</p>
        </Card>
      ) : filteredComponents.length === 0 ? (
        <Card className="p-8 text-center bg-white border-dashed border-2 border-gray-300">
          <p className="text-gray-500">Add components to your widget from the left panel</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Render header component outside of drag context if it exists and matches filter */}
          {filteredHeaderComponent && (
            <Card className="bg-white border border-blue-500 shadow-sm">
              <ComponentEditor
                component={filteredHeaderComponent}
                apis={apis}
                isExpanded={expandedComponentId === filteredHeaderComponent.id}
                onToggleExpand={() => 
                  setExpandedComponentId(
                    expandedComponentId === filteredHeaderComponent.id ? null : filteredHeaderComponent.id
                  )
                }
                onUpdateComponent={onUpdateComponent}
                onRemoveComponent={undefined} // Prevent header removal
                onRequestApiTemplate={() => onRequestApiTemplate(filteredHeaderComponent.id)}
                onApplyTooltip={onApplyTooltip ? 
                  (tooltipId: string) => onApplyTooltip(filteredHeaderComponent.id, tooltipId) : 
                  undefined}
              />
            </Card>
          )}
          
          {/* Only make non-header components draggable */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="components">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {filteredNonHeaderComponents.map((component, index) => (
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
        </div>
      )}
    </div>
  );
};

export default WidgetBuilder;
