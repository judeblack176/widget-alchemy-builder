
import React, { useState, useEffect } from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import ComponentEditor from './ComponentEditor';
import { Card } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip } from './TooltipManager';
import SearchBar from './SearchBar';
import { Button } from '@/components/ui/button';

interface WidgetBuilderProps {
  components: WidgetComponent[];
  apis: ApiConfig[];
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onReorderComponents: (reorderedComponents: WidgetComponent[]) => void;
  onRequestApiTemplate: (componentId: string) => void;
  onApplyTooltip?: (componentId: string, tooltipId: string) => void;
  tooltips?: Tooltip[];
}

const WidgetBuilder: React.FC<WidgetBuilderProps> = ({
  components,
  apis,
  onUpdateComponent,
  onRemoveComponent,
  onReorderComponents,
  onRequestApiTemplate,
  onApplyTooltip,
  tooltips = []
}) => {
  
  const [expandedComponentId, setExpandedComponentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  useEffect(() => {
    if (tooltips && onApplyTooltip) {
      const validTooltipIds = [
        'help', 'info', 'warning', 'tip',
        ...tooltips.map(t => t.id)
      ];
      
      components.forEach(component => {
        if (component.tooltipId && !validTooltipIds.includes(component.tooltipId)) {
          onApplyTooltip(component.id, "");
        }
      });
    }
  }, [tooltips, components, onApplyTooltip]);
  
  const alertComponents = components.filter(c => c.type === 'alert');
  const hasAlertComponent = alertComponents.length > 0;
  
  const nonHeaderNonAlertComponents = components.filter(c => c.type !== 'header' && c.type !== 'alert');
  const MAX_COMPONENTS = hasAlertComponent ? 7 : 6;
  const atComponentLimit = nonHeaderNonAlertComponents.length >= MAX_COMPONENTS;

  const headerComponent = components.find(c => c.type === 'header');

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const items = Array.from(nonHeaderNonAlertComponents);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    let reorderedComponents = [];
    
    if (headerComponent) {
      reorderedComponents.push(headerComponent);
    }
    
    if (alertComponents.length > 0) {
      reorderedComponents = [...reorderedComponents, ...alertComponents];
    }
    
    reorderedComponents = [...reorderedComponents, ...items];

    onReorderComponents(reorderedComponents);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredComponents = components.filter(component => {
    if (!searchQuery.trim()) return true;
    
    if (component.type.toLowerCase().includes(searchQuery.toLowerCase())) {
      return true;
    }
    
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

  const filteredHeaderComponent = headerComponent && filteredComponents.includes(headerComponent) 
    ? headerComponent 
    : null;
  const filteredAlertComponents = alertComponents.filter(alert => filteredComponents.includes(alert));
  const filteredRegularComponents = filteredComponents.filter(c => c.type !== 'header' && c.type !== 'alert');

  // Common card style for consistent width
  const cardStyle = "w-full bg-white border shadow-sm";

  return (
    <div className="flex flex-col h-full">
      {/* Fixed section - header, alert, search */}
      <div className="sticky top-0 bg-widget-gray z-10 space-y-4 pb-4">
        {atComponentLimit && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              Maximum of {MAX_COMPONENTS} components reached (excluding header and alerts). Please remove a component before adding a new one.
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-4">
          <SearchBar
            placeholder="Search components..."
            onSearch={handleSearch}
            className="w-full"
          />
        </div>
        
        {/* Fixed header component section */}
        {filteredHeaderComponent && (
          <Card className={`${cardStyle} border-blue-500`}>
            <div 
              className="relative w-full cursor-pointer" 
              onClick={() => setExpandedComponentId(
                expandedComponentId === filteredHeaderComponent.id ? null : filteredHeaderComponent.id
              )}
            >
              <ComponentEditor
                component={filteredHeaderComponent}
                apis={apis}
                isExpanded={expandedComponentId === filteredHeaderComponent.id}
                onToggleExpand={() => {}}  // Empty function as we're handling this on the parent div
                onUpdateComponent={onUpdateComponent}
                onRemoveComponent={onRemoveComponent}
                onRequestApiTemplate={() => onRequestApiTemplate(filteredHeaderComponent.id)}
                onApplyTooltip={onApplyTooltip ? 
                  (tooltipId: string) => onApplyTooltip(filteredHeaderComponent.id, tooltipId) : 
                  undefined}
                disableRemove={true}
                customTooltips={tooltips}
                showActionButtons={false}
              />
            </div>
          </Card>
        )}
        
        {/* Fixed alert section */}
        {filteredAlertComponents.length > 0 && (
          <div className="space-y-4">
            {filteredAlertComponents.map((alertComponent) => (
              <Card key={alertComponent.id} className={`${cardStyle} border-amber-500`}>
                <div className="relative w-full">
                  <div 
                    className="cursor-pointer flex-grow" 
                    onClick={() => setExpandedComponentId(
                      expandedComponentId === alertComponent.id ? null : alertComponent.id
                    )}
                  >
                    <ComponentEditor
                      component={alertComponent}
                      apis={apis}
                      isExpanded={expandedComponentId === alertComponent.id}
                      onToggleExpand={() => {}}  // Empty function as we're handling this in the parent div
                      onUpdateComponent={onUpdateComponent}
                      onRemoveComponent={onRemoveComponent}
                      onRequestApiTemplate={() => onRequestApiTemplate(alertComponent.id)}
                      onApplyTooltip={onApplyTooltip ? 
                        (tooltipId: string) => onApplyTooltip(alertComponent.id, tooltipId) : 
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
                      onRemoveComponent(alertComponent.id);
                    }}
                    className="absolute top-3 right-3 h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Scrollable section - fixing the scrolling issue */}
      <div className="flex-1 overflow-auto">
        <div className="pr-4 pb-4">
          {filteredComponents.length === 0 && searchQuery.trim() !== '' ? (
            <Card className="p-8 text-center bg-white border-dashed border-2 border-gray-300">
              <p className="text-gray-500">No components match your search</p>
            </Card>
          ) : filteredComponents.length === 0 ? (
            <Card className="p-8 text-center bg-white border-dashed border-2 border-gray-300">
              <p className="text-gray-500">Add components to your widget from the left panel</p>
            </Card>
          ) : filteredRegularComponents.length > 0 && (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="components">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4 pr-2"
                  >
                    {filteredRegularComponents.map((component, index) => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default WidgetBuilder;
