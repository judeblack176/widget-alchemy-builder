
import React from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import { Card } from '@/components/ui/card';
import ComponentEditor from '../component-editor';
import { Tooltip } from '../TooltipManager';

interface AlertComponentsSectionProps {
  alertComponents: WidgetComponent[];
  expandedComponentId: string | null;
  setExpandedComponentId: (id: string | null) => void;
  apis: ApiConfig[];
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onRequestApiTemplate: (componentId: string) => void;
  onApplyTooltip?: (componentId: string, tooltipId: string) => void;
  tooltips?: Tooltip[];
}

const AlertComponentsSection: React.FC<AlertComponentsSectionProps> = ({
  alertComponents,
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

  return (
    <div className="space-y-4">
      {alertComponents.map((alertComponent) => (
        <Card key={alertComponent.id} className={`${cardStyle} border-amber-500`}>
          <div className="relative w-full">
            <ComponentEditor
              component={alertComponent}
              apis={apis}
              isExpanded={expandedComponentId === alertComponent.id}
              onToggleExpand={() => {
                setExpandedComponentId(
                  expandedComponentId === alertComponent.id ? null : alertComponent.id
                );
              }}
              onUpdateComponent={onUpdateComponent}
              onRemoveComponent={onRemoveComponent}
              onRequestApiTemplate={() => onRequestApiTemplate(alertComponent.id)}
              onApplyTooltip={onApplyTooltip ? 
                (tooltipId: string) => onApplyTooltip(alertComponent.id, tooltipId) : 
                undefined}
              customTooltips={tooltips}
              showActionButtons={true} // Changed from false to true to allow removal
              disableRemove={false} // Explicitly allow removal
            />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AlertComponentsSection;
