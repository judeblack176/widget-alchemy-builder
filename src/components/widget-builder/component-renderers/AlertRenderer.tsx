
import React from 'react';
import { WidgetComponent, AlertType } from '@/types';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, CheckCircle, AlertTriangle, AlertCircle, X } from 'lucide-react';

interface AlertRendererProps {
  component: WidgetComponent;
  finalProps: Record<string, any>;
  onDismiss?: (id: string) => void;
}

const AlertRenderer: React.FC<AlertRendererProps> = ({ component, finalProps, onDismiss }) => {
  const { id } = component;
  const alertType = finalProps.type as AlertType || 'info';
  const isDismissible = finalProps.dismissible !== false;
  
  return (
    <Alert
      variant="default"
      className="relative"
      style={{
        backgroundColor: finalProps.backgroundColor || '#EFF6FF',
        color: finalProps.textColor || '#1E3A8A',
        borderColor: finalProps.borderColor || '#BFDBFE'
      }}
    >
      {finalProps.icon !== false && (
        <div className="mr-2">
          {alertType === 'info' && <Info className="h-4 w-4" />}
          {alertType === 'success' && <CheckCircle className="h-4 w-4" />}
          {alertType === 'warning' && <AlertTriangle className="h-4 w-4" />}
          {alertType === 'error' && <AlertCircle className="h-4 w-4" />}
        </div>
      )}
      <div className="flex-grow">
        <AlertTitle>{finalProps.title || "Alert"}</AlertTitle>
        <AlertDescription>{finalProps.message || "This is an alert message."}</AlertDescription>
      </div>
      {isDismissible && onDismiss && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-0 h-6 w-6 rounded-full absolute top-2 right-2"
          onClick={() => onDismiss(id)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      )}
    </Alert>
  );
};

export default AlertRenderer;
