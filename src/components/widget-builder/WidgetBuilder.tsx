
import React, { useState } from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip } from './TooltipManager';
import SearchBar from './SearchBar';
import WidgetComponentList from './WidgetComponentList';
import EmptyStateMessage from './EmptyStateMessage';
import ComponentLimitAlert from './ComponentLimitAlert';

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
  
  // Calculate component limits and filtered components
  const alertComponents = components.filter(c => c.type === 'alert');
  const hasAlertComponent = alertComponents.length > 0;
  const nonHeaderNonAlertComponents = components.filter(c => c.type !== 'header' && c.type !== 'alert');
  const MAX_COMPONENTS = hasAlertComponent ? 7 : 6;
  const atComponentLimit = nonHeaderNonAlertComponents.length >= MAX_COMPONENTS;

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const items = Array.from(nonHeaderNonAlertComponents);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    let reorderedComponents = [];
    
    const headerComponent = components.find(c => c.type === 'header');
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

  const handleToggleExpand = (componentId: string) => {
    setExpandedComponentId(expandedComponentId === componentId ? null : componentId);
  };

  // Filter components based on search query
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

  return (
    <div className="flex flex-col h-full">
      {/* Fixed section - header, alert, search */}
      <div className="sticky top-0 bg-widget-gray z-10 space-y-4 pb-4">
        {atComponentLimit && (
          <ComponentLimitAlert maxComponents={MAX_COMPONENTS} />
        )}

        <div className="mb-4">
          <SearchBar
            placeholder="Search components..."
            onSearch={handleSearch}
            className="w-full"
          />
        </div>
      </div>
      
      {/* Scrollable section - fixing the scrolling issue */}
      <div className="flex-1 overflow-auto">
        <div className="pr-4 pb-4">
          {filteredComponents.length === 0 ? (
            <EmptyStateMessage hasSearchQuery={searchQuery.trim() !== ''} />
          ) : (
            <WidgetComponentList
              components={filteredComponents}
              apis={apis}
              expandedComponentId={expandedComponentId}
              onToggleExpand={handleToggleExpand}
              onUpdateComponent={onUpdateComponent}
              onRemoveComponent={onRemoveComponent}
              onRequestApiTemplate={onRequestApiTemplate}
              onApplyTooltip={onApplyTooltip}
              customTooltips={tooltips}
              onDragEnd={handleDragEnd}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WidgetBuilder;
