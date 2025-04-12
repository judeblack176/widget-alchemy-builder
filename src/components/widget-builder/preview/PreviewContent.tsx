
import React from 'react';
import { WidgetComponent } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import PreviewComponent from './PreviewComponent';
import PreviewLimitWarning from './PreviewLimitWarning';
import { processComponentData } from './previewUtils';

interface PreviewContentProps {
  displayComponents: WidgetComponent[];
  headerComponent?: WidgetComponent;
  hasExcessComponents: boolean;
  nonHeaderNonAlertComponents: WidgetComponent[];
  MAX_COMPONENTS: number;
  apiData: Record<string, any>;
  dismissedAlerts: string[];
  handleAlertDismiss: (alertId: string) => void;
}

const PreviewContent: React.FC<PreviewContentProps> = ({
  displayComponents,
  headerComponent,
  hasExcessComponents,
  nonHeaderNonAlertComponents,
  MAX_COMPONENTS,
  apiData,
  dismissedAlerts,
  handleAlertDismiss
}) => {
  // Filter out components that shouldn't be displayed
  const filteredComponents = displayComponents
    .filter(component => component.id !== headerComponent?.id)
    .filter(component => !(component.type === 'alert' && dismissedAlerts.includes(component.id)));

  return (
    <ScrollArea className="h-full w-full">
      <div className={headerComponent ? "pt-2" : ""}>
        {filteredComponents.map((component, index) => {
          const componentData = processComponentData(component, apiData);
          
          return (
            <PreviewComponent
              key={component.id}
              component={component}
              componentData={componentData}
              index={index + (headerComponent ? 1 : 0)}
              handleAlertDismiss={handleAlertDismiss}
            />
          );
        })}
        
        <PreviewLimitWarning
          hasExcessComponents={hasExcessComponents}
          nonHeaderNonAlertComponentsCount={nonHeaderNonAlertComponents.length}
          maxComponents={MAX_COMPONENTS}
        />
      </div>
    </ScrollArea>
  );
};

export default PreviewContent;
