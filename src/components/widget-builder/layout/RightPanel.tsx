
import React from 'react';
import { useWidget } from '@/contexts/WidgetContext';
import WidgetPreview from '@/components/widget-builder/WidgetPreview';
import { WidgetSubmissionForm } from '@/components/widget-builder/submission';
import PreviewToolbar from './PreviewToolbar';
import { useLocation } from 'react-router-dom';

const RightPanel: React.FC = () => {
  const { widgetComponents, apis, isEditing } = useWidget();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const widgetId = queryParams.get('widgetId');

  const handleSubmitSuccess = () => {
    // Logic when submission is successful
  };

  return (
    <div className="w-1/3 bg-gray-200 overflow-hidden flex flex-col">
      <PreviewToolbar />
      <div className="flex-1 overflow-auto flex flex-col items-center justify-start pt-8 px-4">
        <WidgetPreview components={widgetComponents} apis={apis} />
        
        <div className="mt-6 mb-4">
          <WidgetSubmissionForm
            widgetComponents={widgetComponents}
            apis={apis}
            onSubmitSuccess={handleSubmitSuccess}
            widgetId={widgetId}
            isEditing={isEditing}
          />
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
