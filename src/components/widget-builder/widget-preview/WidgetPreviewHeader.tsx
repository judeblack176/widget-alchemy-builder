
import React from 'react';
import { WidgetComponent } from '@/types/widget-types';
import { renderComponent } from '@/components/widget-builder/component-renderers';
import { Tooltip } from '../TooltipManager';

interface WidgetPreviewHeaderProps {
  headerComponent?: WidgetComponent | null;
  componentDataProvider: (component: WidgetComponent) => any;
  tooltips?: Tooltip[];
}

const WidgetPreviewHeader: React.FC<WidgetPreviewHeaderProps> = ({ 
  headerComponent, 
  componentDataProvider,
  tooltips = []
}) => {
  if (!headerComponent) {
    return (
      <div className="bg-gray-50 p-3 border-b border-gray-200">
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-200">
      {renderComponent(
        headerComponent, 
        componentDataProvider(headerComponent),
        undefined,
        tooltips // Pass tooltips here
      )}
    </div>
  );
};

export default WidgetPreviewHeader;
