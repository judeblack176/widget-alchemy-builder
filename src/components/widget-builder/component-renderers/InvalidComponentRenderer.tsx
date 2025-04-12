
import React from 'react';
import { WidgetComponent } from '@/types';

interface InvalidComponentRendererProps {
  component: WidgetComponent;
}

const InvalidComponentRenderer: React.FC<InvalidComponentRendererProps> = ({ component }) => {
  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded">
      <p className="text-red-500">Unsupported component type: {component.type}</p>
    </div>
  );
};

export default InvalidComponentRenderer;
