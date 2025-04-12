
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface PreviewLimitWarningProps {
  hasExcessComponents: boolean;
  nonHeaderNonAlertComponentsCount: number;
  maxComponents: number;
}

const PreviewLimitWarning: React.FC<PreviewLimitWarningProps> = ({ 
  hasExcessComponents,
  nonHeaderNonAlertComponentsCount,
  maxComponents
}) => {
  if (!hasExcessComponents) return null;
  
  return (
    <Alert variant="destructive" className="mt-2 mx-4 mb-4 py-2">
      <AlertCircle className="h-4 w-4 mr-2" />
      <AlertDescription>
        Only showing {maxComponents} of {nonHeaderNonAlertComponentsCount} components. 
        Widgets are limited to {maxComponents} components (excluding header and alerts).
      </AlertDescription>
    </Alert>
  );
};

export default PreviewLimitWarning;
