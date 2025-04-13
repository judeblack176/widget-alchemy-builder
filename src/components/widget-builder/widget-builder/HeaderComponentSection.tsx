
import React, { useEffect } from 'react';
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
  
  // Auto-expand header component on mount
  useEffect(() => {
    if (expandedComponentId !== headerComponent.id) {
      setExpandedComponentId(headerComponent.id);
    }
  }, [headerComponent.id, expandedComponentId, setExpandedComponentId]);

  return (
    <Card className={`${cardStyle} border-blue-500`}>
      <div className="relative w-full">
        <ComponentEditor
          component={headerComponent}
          apis={apis}
          isExpanded={expandedComponentId === headerComponent.id}
          onToggleExpand={() => setExpandedComponentId(
            expandedComponentId === headerComponent.id ? null : headerComponent.id
          )}
          onUpdateComponent={onUpdateComponent}
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
