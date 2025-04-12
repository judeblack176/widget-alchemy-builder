
import React, { useState, useEffect } from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import ComponentEditor from './ComponentEditor';
import { Card } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip } from './TooltipManager';
import SearchBar from './SearchBar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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
  const [isTagFilterOpen, setIsTagFilterOpen] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Extract all unique tags from tooltips
  const allTags = tooltips
    .flatMap(tooltip => tooltip.tags || [])
    .filter((tag, index, self) => self.indexOf(tag) === index)
    .sort();
  
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

  const handleTagFilterToggle = () => {
    setIsTagFilterOpen(!isTagFilterOpen);
  };

  const handleTagSelectionChange = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const clearTagFilters = () => {
    setSelectedTags([]);
    setIsTagFilterOpen(false);
  };

  // Filter tooltips by selected tags
  const filteredTooltips = tooltips.filter(tooltip => {
    if (selectedTags.length === 0) return true;
    return tooltip.tags?.some(tag => selectedTags.includes(tag));
  });

  // Get all tooltipIds from the filtered tooltips
  const filteredTooltipIds = filteredTooltips.map(tooltip => tooltip.id);

  const filteredComponents = components.filter(component => {
    // Apply text search filter
    const matchesTextSearch = !searchQuery.trim() || 
      component.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.entries(component.props).some(
        ([key, value]) => typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    // Apply tag filter if any tags are selected
    const matchesTagFilter = selectedTags.length === 0 || 
      !component.tooltipId || 
      filteredTooltipIds.includes(component.tooltipId);
    
    return matchesTextSearch && matchesTagFilter;
  });

  const filteredHeaderComponent = headerComponent && filteredComponents.includes(headerComponent) 
    ? headerComponent 
    : null;
  const filteredAlertComponents = alertComponents.filter(alert => filteredComponents.includes(alert));
  const filteredRegularComponents = filteredComponents.filter(c => c.type !== 'header' && c.type !== 'alert');

  return (
    <div className="space-y-4 flex flex-col h-full">
      {/* Fixed section - header, alert, search, and filtered components */}
      <div className="sticky top-0 bg-widget-gray z-10 space-y-4">
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
            showTagFilter={allTags.length > 0}
            onTagFilterClick={handleTagFilterToggle}
            className="w-full"
          />
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
      
      {/* Scrollable section - only this part scrolls */}
      <div className="flex-1 overflow-auto pb-4">
        {filteredComponents.length === 0 && searchQuery.trim() !== '' ? (
          <Card className="p-8 text-center bg-white border-dashed border-2 border-gray-300">
            <p className="text-gray-500">No components match your search</p>
          </Card>
        ) : filteredComponents.length === 0 ? (
          <Card className="p-8 text-center bg-white border-dashed border-2 border-gray-300">
            <p className="text-gray-500">Add components to your widget from the left panel</p>
          </Card>
        ) : filteredRegularComponents.length > 0 && (
          <div className="h-full overflow-auto pr-2">
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
          </div>
        )}
      </div>

      {/* Tag Filter Dialog */}
      <Dialog open={isTagFilterOpen} onOpenChange={setIsTagFilterOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filter by Tags</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {allTags.length === 0 ? (
              <p className="text-center text-muted-foreground">No tags available</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2">
                {allTags.map(tag => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`tag-${tag}`} 
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => handleTagSelectionChange(tag)}
                    />
                    <Label htmlFor={`tag-${tag}`} className="flex-1 cursor-pointer">
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-between py-2">
            <div className="flex flex-wrap gap-1">
              {selectedTags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleTagSelectionChange(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={clearTagFilters}>
              Clear All
            </Button>
            <Button onClick={() => setIsTagFilterOpen(false)}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WidgetBuilder;
