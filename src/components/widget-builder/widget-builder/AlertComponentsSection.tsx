
import React from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
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
  );
};

export default AlertComponentsSection;
