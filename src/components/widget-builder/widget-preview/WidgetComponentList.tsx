
import React from 'react';
import { WidgetComponent } from '@/types/widget-types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import ComponentRenderer from './ComponentRenderer';

interface WidgetComponentListProps {
  displayComponents: WidgetComponent[];
  headerComponent: WidgetComponent | null;
  componentDataProvider: (component: WidgetComponent) => any;
  hasExcessComponents: boolean;
  maxComponents: number;
  nonHeaderNonAlertComponentsLength: number;
  onAlertDismiss: (alertId: string) => void;
}

const WidgetComponentList: React.FC<WidgetComponentListProps> = ({
  displayComponents,
  headerComponent,
  componentDataProvider,
  hasExcessComponents,
  maxComponents,
  nonHeaderNonAlertComponentsLength,
  onAlertDismiss
}) => {
  return (
    <div className={headerComponent ? "pt-2" : ""}>
      {displayComponents
        .filter(component => component.id !== headerComponent?.id)
        .map((component, index) => (
          <ComponentRenderer
            key={component.id}
            component={component}
            componentData={componentDataProvider(component)}
            index={index + (headerComponent ? 1 : 0)}
            onAlertDismiss={onAlertDismiss}
            headerComponent={headerComponent}
          />
        ))}
      
      {hasExcessComponents && (
        <Alert variant="destructive" className="mt-2 mx-4 mb-4 py-2">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Only showing {maxComponents} of {nonHeaderNonAlertComponentsLength} components. 
            Widgets are limited to {maxComponents} components (excluding header and alerts).
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default WidgetComponentList;
