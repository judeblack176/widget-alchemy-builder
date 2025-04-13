
import React from 'react';
import { AlertType } from '@/types/component-types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, CheckCircle, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const alertRenderer = (finalProps: Record<string, any>, id: string, onDismiss?: (id: string) => void) => {
  const alertType = finalProps.type as AlertType || 'info';
  const isDismissible = finalProps.dismissible !== false;
  
  // Use formattedContent directly instead of falling back to message
  const alertContent = finalProps.formattedContent || "This is an alert message.";
  
  // Get the title, which might be a formatted content value
  const alertTitle = finalProps.title || "Alert";
  
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
        <AlertTitle dangerouslySetInnerHTML={{ __html: alertTitle }} />
        <AlertDescription dangerouslySetInnerHTML={{ __html: alertContent }} />
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
