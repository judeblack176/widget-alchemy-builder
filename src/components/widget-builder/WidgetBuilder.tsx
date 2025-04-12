
import React, { useState, useEffect } from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import ComponentEditor from './ComponentEditor';
import { Card } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowDownAZ, ArrowUpAZ, SortAsc, SortDesc } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip as TooltipType } from './TooltipManager';
import SearchBar from './SearchBar';
import { Button } from '@/components/ui/button';
import { TooltipProvider, TooltipContent, TooltipTrigger, Tooltip } from '@/components/ui/tooltip';

interface WidgetBuilderProps {
  components: WidgetComponent[];
  apis: ApiConfig[];
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onReorderComponents: (reorderedComponents: WidgetComponent[]) => void;
  onRequestApiTemplate: (componentId: string) => void;
  onApplyTooltip?: (componentId: string, tooltipId: string) => void;
  tooltips?: TooltipType[];
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
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  
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

  const toggleSort = () => {
    setSortDirection(prev => {
      if (prev === null) return 'asc';
      if (prev === 'asc') return 'desc';
      return null;
    });
  };

  const getFilteredComponents = () => {
    let filtered = components.filter(component => {
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

    if (sortDirection) {
      const headerAndAlerts = filtered.filter(c => c.type === 'header' || c.type === 'alert');
      const otherComponents = filtered.filter(c => c.type !== 'header' && c.type !== 'alert');
      
      otherComponents.sort((a, b) => {
        const aType = a.type.toLowerCase();
        const bType = b.type.toLowerCase();
        return sortDirection === 'asc' 
          ? aType.localeCompare(bType) 
          : bType.localeCompare(aType);
      });
      
      filtered = [...headerAndAlerts, ...otherComponents];
    }
    
    return filtered;
  };

  const filteredComponents = getFilteredComponents();
  const filteredHeaderComponent = headerComponent && filteredComponents.includes(headerComponent) 
    ? headerComponent 
    : null;
  const filteredAlertComponents = alertComponents.filter(alert => filteredComponents.includes(alert));
  const filteredRegularComponents = filteredComponents.filter(c => c.type !== 'header' && c.type !== 'alert');

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

        <div className="flex items-center gap-2 mb-4">
          <SearchBar
            placeholder="Search components..."
            onSearch={handleSearch}
            className="flex-grow"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSort}
                  className={`h-8 w-8 p-0 flex items-center justify-center ${sortDirection ? 'bg-blue-50' : ''}`}
                >
                  {sortDirection === 'asc' ? (
                    <SortAsc size={16} />
                  ) : sortDirection === 'desc' ? (
                    <SortDesc size={16} />
                  ) : (
                    <SortAsc size={16} className="text-gray-400" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{sortDirection === 'asc' ? 'Sort Z-A' : sortDirection === 'desc' ? 'Clear sorting' : 'Sort A-Z'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Fixed header component section */}
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
              onRemoveComponent={onRemoveComponent}
              onRequestApiTemplate={() => onRequestApiTemplate(filteredHeaderComponent.id)}
              onApplyTooltip={onApplyTooltip ? 
                (tooltipId: string) => onApplyTooltip(filteredHeaderComponent.id, tooltipId) : 
                undefined}
              disableRemove={true}
              customTooltips={tooltips}
            />
          </Card>
        )}
        
        {/* Fixed alert section */}
        {filteredAlertComponents.length > 0 && (
          <div className="space-y-4">
            {filteredAlertComponents.map((alertComponent) => (
              <Card key={alertComponent.id} className="bg-white border border-amber-500 shadow-sm">
                <ComponentEditor
                  component={alertComponent}
                  apis={apis}
                  isExpanded={expandedComponentId === alertComponent.id}
                  onToggleExpand={() => 
                    setExpandedComponentId(
                      expandedComponentId === alertComponent.id ? null : alertComponent.id
                    )
                  }
                  onUpdateComponent={onUpdateComponent}
                  onRemoveComponent={onRemoveComponent}
                  onRequestApiTemplate={() => onRequestApiTemplate(alertComponent.id)}
                  onApplyTooltip={onApplyTooltip ? 
                    (tooltipId: string) => onApplyTooltip(alertComponent.id, tooltipId) : 
                    undefined}
                  customTooltips={tooltips}
                />
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
                                customTooltips={tooltips}
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
      </div>
    </div>
  );
};

export default WidgetBuilder;
