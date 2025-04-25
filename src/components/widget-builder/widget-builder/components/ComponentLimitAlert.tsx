
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ComponentLimitAlertProps {
  show: boolean;
  maxComponents: number;
}

const ComponentLimitAlert: React.FC<ComponentLimitAlertProps> = ({
  show,
  maxComponents
}) => {
  if (!show) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4 mr-2" />
      <AlertDescription>
        Maximum of {maxComponents} components reached (excluding header and alerts). Please remove a component before adding a new one.
      </AlertDescription>
    </Alert>
  );
};

export default ComponentLimitAlert;
