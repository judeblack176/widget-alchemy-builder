
import React from 'react';
import { WidgetComponent } from '@/types/widget-types';
import ComponentRenderer from './ComponentRenderer';

interface WidgetPreviewHeaderProps {
  headerComponent: WidgetComponent | null;
  componentDataProvider: (component: WidgetComponent) => any;
}

const WidgetPreviewHeader: React.FC<WidgetPreviewHeaderProps> = ({ 
  headerComponent, 
  componentDataProvider 
}) => {
  if (!headerComponent) {
    return null;
  }

  return (
    <div className="sticky top-0 z-20">
      <ComponentRenderer
        component={headerComponent}
        componentData={componentDataProvider(headerComponent)}
        index={0}
        headerComponent={headerComponent}
      />
    </div>
  );
};

export default WidgetPreviewHeader;
