
import React from 'react';
import { WidgetComponent } from '@/types/widget-types';
import ComponentRenderer from './ComponentRenderer';
import { Tooltip } from '../TooltipManager';

interface WidgetComponentListProps {
  displayComponents: WidgetComponent[];
  headerComponent: WidgetComponent | undefined;
  componentDataProvider: (component: WidgetComponent) => any;
  hasExcessComponents: boolean;
  maxComponents: number;
  nonHeaderNonAlertComponentsLength: number;
  onAlertDismiss: (alertId: string) => void;
  tooltips?: Tooltip[];
}

const WidgetComponentList: React.FC<WidgetComponentListProps> = ({
  displayComponents,
  headerComponent,
  componentDataProvider,
  hasExcessComponents,
  maxComponents,
  nonHeaderNonAlertComponentsLength,
  onAlertDismiss,
  tooltips = []
}) => {
  return (
    <div className="pb-4">
      {displayComponents.map((component, idx) => (
        <ComponentRenderer
          key={component.id}
          component={component}
          componentData={componentDataProvider(component)}
          index={idx}
          onAlertDismiss={onAlertDismiss}
          headerComponent={headerComponent}
          tooltips={tooltips}
        />
      ))}
      
      {hasExcessComponents && (
        <div className="px-4 py-3 text-xs text-gray-500 italic border-t border-gray-200">
          <p>+{nonHeaderNonAlertComponentsLength - maxComponents} more components not shown</p>
          <p>Widgets are limited to {maxComponents} components (excluding header and alerts)</p>
        </div>
      )}
    </div>
  );
};

export default WidgetComponentList;
