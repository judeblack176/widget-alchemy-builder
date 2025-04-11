
import React, { useState } from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import ComponentEditor from './ComponentEditor';
import { Card } from '@/components/ui/card';

interface WidgetBuilderProps {
  components: WidgetComponent[];
  apis: ApiConfig[];
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onReorderComponents: (reorderedComponents: WidgetComponent[]) => void;
  onRequestApiTemplate: (componentId: string) => void;
  onApplyTooltip?: (componentId: string, tooltipId: string) => void;
}

const WidgetBuilder: React.FC<WidgetBuilderProps> = ({
  components,
  apis,
  onUpdateComponent,
  onRemoveComponent,
  onReorderComponents,
  onRequestApiTemplate,
  onApplyTooltip
}) => {
  const [expandedComponentId, setExpandedComponentId] = useState<string | null>(null);

  const handleReorder = (components: WidgetComponent[]) => {
    onReorderComponents(components);
  };

  return (
    <div className="space-y-4">
      {components.length === 0 && (
        <Card className="p-8 text-center bg-white border-dashed border-2 border-gray-300">
          <p className="text-gray-500">Add components to your widget from the left panel</p>
        </Card>
      )}
      
      {components.map((component, index) => (
        <div key={component.id} className="relative">
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
            />
          </Card>
        </div>
      ))}
    </div>
  );
};

export default WidgetBuilder;
