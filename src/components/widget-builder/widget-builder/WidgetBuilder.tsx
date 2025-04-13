
import React, { useState, useEffect } from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Tooltip } from '../TooltipManager';
import { Droppable } from 'react-beautiful-dnd';
import SearchBar from '../SearchBar';
import HeaderComponentSection from './HeaderComponentSection';
import AlertComponentsSection from './AlertComponentsSection';
import DraggableComponentsList from './DraggableComponentsList';
import EmptyStateMessage from './EmptyStateMessage';

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
        
        {/* Header Component Section */}
        {filteredHeaderComponent && (
          <HeaderComponentSection 
            headerComponent={filteredHeaderComponent}
            expandedComponentId={expandedComponentId}
            setExpandedComponentId={setExpandedComponentId}
            apis={apis}
            onUpdateComponent={onUpdateComponent}
            onRemoveComponent={onRemoveComponent}
            onRequestApiTemplate={onRequestApiTemplate}
            onApplyTooltip={onApplyTooltip}
            tooltips={tooltips}
          />
        )}
        
        {/* Alert Components Section */}
        {filteredAlertComponents.length > 0 && (
          <AlertComponentsSection
            alertComponents={filteredAlertComponents}
            expandedComponentId={expandedComponentId}
            setExpandedComponentId={setExpandedComponentId}
            apis={apis}
            onUpdateComponent={onUpdateComponent}
            onRemoveComponent={onRemoveComponent}
            onRequestApiTemplate={onRequestApiTemplate}
            onApplyTooltip={onApplyTooltip}
            tooltips={tooltips}
          />
        )}
      </div>
      
      {/* Scrollable section - regular components */}
      <div className="flex-1 overflow-auto">
        <div className="pr-4 pb-4">
          {filteredComponents.length === 0 && searchQuery.trim() !== '' ? (
            <EmptyStateMessage message="No components match your search" />
          ) : filteredComponents.length === 0 ? (
            <EmptyStateMessage message="Add components to your widget from the left panel" />
          ) : filteredRegularComponents.length > 0 && (
            <DraggableComponentsList
              components={filteredRegularComponents}
              expandedComponentId={expandedComponentId}
              setExpandedComponentId={setExpandedComponentId}
              apis={apis}
              onUpdateComponent={onUpdateComponent}
              onRemoveComponent={onRemoveComponent}
              onRequestApiTemplate={onRequestApiTemplate}
              onApplyTooltip={onApplyTooltip}
              tooltips={tooltips}
              onDragEnd={handleDragEnd}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WidgetBuilder;
