
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

  // Ensure headerComponent has formattedContent set
  const processedHeaderComponent = {
    ...headerComponent,
    // Initialize with name if formattedContent is not set
    formattedContent: headerComponent.formattedContent || headerComponent.props?.name || "Header"
  };

  return (
    <div className="sticky top-0 z-20">
      <ComponentRenderer
        component={processedHeaderComponent}
        componentData={componentDataProvider(processedHeaderComponent)}
        index={0}
        headerComponent={processedHeaderComponent}
      />
    </div>
  );
};

export default WidgetPreviewHeader;
