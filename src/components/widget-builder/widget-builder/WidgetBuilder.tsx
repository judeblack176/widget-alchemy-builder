
import React from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import { Tooltip } from '../TooltipManager';
import SearchBar from '../SearchBar';
import HeaderComponentSection from './HeaderComponentSection';
import AlertComponentsSection from './AlertComponentsSection';
import DraggableComponentsList from './DraggableComponentsList';
import ComponentLimitAlert from './components/ComponentLimitAlert';
import EmptyStateHandler from './components/EmptyStateHandler';
import { useWidgetBuilderState } from './hooks/useWidgetBuilderState';

interface WidgetBuilderProps {
  components: WidgetComponent[];
  apis: ApiConfig[];
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onReorderComponents: (reorderedComponents: WidgetComponent[]) => void;
  onRequestApiTemplate: (componentId: string) => void;
  onApplyTooltip?: (componentId: string, tooltipId: string) => void;
  tooltips?: Tooltip[];
  isTemplate?: boolean;
  onToggleVisibility?: (componentId: string, visible: boolean) => void;
}

const WidgetBuilder: React.FC<WidgetBuilderProps> = ({
  components,
  apis,
  onUpdateComponent,
  onRemoveComponent,
  onReorderComponents,
  onRequestApiTemplate,
  onApplyTooltip,
  tooltips = [],
  isTemplate = false,
  onToggleVisibility
}) => {
  const {
    expandedComponentId,
    setExpandedComponentId,
    searchQuery,
    setSearchQuery,
    filteredHeaderComponent,
    filteredAlertComponents,
    filteredRegularComponents,
    atComponentLimit,
    MAX_COMPONENTS,
    filteredComponents
  } = useWidgetBuilderState(components);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const items = Array.from(filteredRegularComponents);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    let reorderedComponents = [];
    
    if (filteredHeaderComponent) {
      reorderedComponents.push(filteredHeaderComponent);
    }
    
    if (filteredAlertComponents.length > 0) {
      reorderedComponents = [...reorderedComponents, ...filteredAlertComponents];
    }
    
    reorderedComponents = [...reorderedComponents, ...items];

    onReorderComponents(reorderedComponents);
  };

  const handleVisibilityToggle = (componentId: string) => {
    const component = components.find(c => c.id === componentId);
    if (component && onToggleVisibility) {
      onToggleVisibility(componentId, !(component.visible ?? true));
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 pb-4">
        <ComponentLimitAlert 
          show={atComponentLimit} 
          maxComponents={MAX_COMPONENTS} 
        />

        <div className="mb-4">
          <SearchBar
            placeholder="Search components..."
            onSearch={setSearchQuery}
            className="w-full"
          />
        </div>
        
        {filteredHeaderComponent && (
          <HeaderComponentSection 
            headerComponent={filteredHeaderComponent}
            expandedComponentId={expandedComponentId}
            setExpandedComponentId={setExpandedComponentId}
            apis={apis}
            onUpdateComponent={onUpdateComponent}
            onRemoveComponent={isTemplate ? undefined : onRemoveComponent}
            onRequestApiTemplate={onRequestApiTemplate}
            onApplyTooltip={onApplyTooltip}
            tooltips={tooltips}
            isTemplate={isTemplate}
            onToggleVisibility={onToggleVisibility ? 
              () => handleVisibilityToggle(filteredHeaderComponent.id) : 
              undefined}
          />
        )}
        
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
      
      <div className="pb-4">
        <EmptyStateHandler 
          filteredComponents={filteredComponents}
          searchQuery={searchQuery}
        />
        
        {filteredRegularComponents.length > 0 && (
          <DraggableComponentsList
            components={filteredRegularComponents}
            expandedComponentId={expandedComponentId}
            setExpandedComponentId={setExpandedComponentId}
            apis={apis}
            onUpdateComponent={onUpdateComponent}
            onRemoveComponent={isTemplate ? undefined : onRemoveComponent}
            onRequestApiTemplate={onRequestApiTemplate}
            onApplyTooltip={onApplyTooltip}
            tooltips={tooltips}
            onDragEnd={handleDragEnd}
            isTemplate={isTemplate}
            onToggleVisibility={onToggleVisibility ? 
              (componentId: string) => handleVisibilityToggle(componentId) : 
              undefined}
          />
        )}
      </div>
    </div>
  );
};

export default WidgetBuilder;
