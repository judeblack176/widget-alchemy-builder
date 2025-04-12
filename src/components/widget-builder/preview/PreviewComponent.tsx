
import React from 'react';
import { WidgetComponent, Tooltip } from '@/types';
import { renderComponent } from '../component-renderers';

interface PreviewComponentProps {
  component: WidgetComponent;
  index: number;
  componentData?: any;
  handleAlertDismiss?: (id: string) => void;
  tooltips?: Tooltip[];
}

const PreviewComponent: React.FC<PreviewComponentProps> = ({ 
  component, 
  index, 
  componentData, 
  handleAlertDismiss,
  tooltips
}) => {
  return (
    <div className="mb-2 rounded overflow-hidden">
      <div className={`component-preview w-full ${component.selected ? 'ring-1 ring-blue-400' : 'border border-gray-200'}`} data-component-id={component.id}>
        {renderComponent(component, componentData, handleAlertDismiss, tooltips)}
      </div>
    </div>
  );
};

export default PreviewComponent;
