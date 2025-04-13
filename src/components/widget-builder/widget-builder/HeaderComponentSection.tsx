
import React from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import { Card } from '@/components/ui/card';
import ComponentEditor from '../component-editor';
import { Tooltip } from '../TooltipManager';

interface HeaderComponentSectionProps {
  headerComponent: WidgetComponent;
  expandedComponentId: string | null;
  setExpandedComponentId: (id: string | null) => void;
  apis: ApiConfig[];
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onRequestApiTemplate: (componentId: string) => void;
  onApplyTooltip?: (componentId: string, tooltipId: string) => void;
  tooltips?: Tooltip[];
}

const HeaderComponentSection: React.FC<HeaderComponentSectionProps> = ({
  headerComponent,
  expandedComponentId,
  setExpandedComponentId,
  apis,
  onUpdateComponent,
  onRemoveComponent,
  onRequestApiTemplate,
  onApplyTooltip,
  tooltips = []
}) => {
  const cardStyle = "w-full bg-white border shadow-sm";

  // Update component when formatted content changes
  const handleUpdateComponent = (updatedComponent: WidgetComponent) => {
    // Initialize formattedContent if needed
    if (updatedComponent.formattedContent === undefined && 
        updatedComponent.props && 
        updatedComponent.props.name) {
      updatedComponent.formattedContent = updatedComponent.props.name;
    }
    onUpdateComponent(updatedComponent);
  };
  
  return (
    <Card className={`${cardStyle} border-blue-500`}>
      <div className="relative w-full">
        <ComponentEditor
          component={headerComponent}
          apis={apis}
          isExpanded={expandedComponentId === headerComponent.id}
          onToggleExpand={() => {
            setExpandedComponentId(
              expandedComponentId === headerComponent.id ? null : headerComponent.id
            );
          }}
          onUpdateComponent={handleUpdateComponent}
          onRemoveComponent={onRemoveComponent}
          onRequestApiTemplate={() => onRequestApiTemplate(headerComponent.id)}
          onApplyTooltip={onApplyTooltip ? 
            (tooltipId: string) => onApplyTooltip(headerComponent.id, tooltipId) : 
            undefined}
          disableRemove={true}
          customTooltips={tooltips}
          showActionButtons={false}
        />
      </div>
    </Card>
  );
};

export default HeaderComponentSection;
