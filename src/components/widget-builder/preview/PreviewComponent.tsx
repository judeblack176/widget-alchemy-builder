
import React from 'react';
import { WidgetComponent, Tooltip } from '@/types';
import { renderComponent } from '../component-renderers';

interface PreviewComponentProps {
  component: WidgetComponent;
  index: number;
  apiData?: Record<string, any>;
  onAlertDismiss?: (id: string) => void;
  tooltips?: Tooltip[];
}

const PreviewComponent: React.FC<PreviewComponentProps> = ({ 
  component, 
  index, 
  apiData, 
  onAlertDismiss,
  tooltips
}) => {
  return (
    <div className={`component-preview ${component.selected ? 'ring-2 ring-blue-400' : ''}`} data-component-id={component.id}>
      {renderComponent(component, apiData, onAlertDismiss, tooltips)}
    </div>
  );
};

export default PreviewComponent;
