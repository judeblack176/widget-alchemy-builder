
import React from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import WidgetPreview from '@/components/widget-builder/WidgetPreview';
import WidgetSubmissionForm from '@/components/widget-builder/WidgetSubmissionForm';
import { Tooltip } from '../TooltipManager';
import { Button } from '@/components/ui/button';

interface WidgetPreviewPanelProps {
  widgetComponents: WidgetComponent[];
  apis: ApiConfig[];
  isEditing: boolean;
  widgetId: string | null;
  onSaveWidget: () => void;
  onCancelEditing: () => void;
  onSubmitSuccess: () => void;
  tooltips?: Tooltip[];
}

const WidgetPreviewPanel: React.FC<WidgetPreviewPanelProps> = ({
  widgetComponents,
  apis,
  isEditing,
  widgetId,
  onSaveWidget,
  onCancelEditing,
  onSubmitSuccess,
  tooltips = []
}) => {
  return (
    <div className="w-1/3 border-l border-gray-200 bg-gray-50 p-4 overflow-y-auto">
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Widget Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-4">
            <WidgetPreview components={widgetComponents} apis={apis} tooltips={tooltips} />
          </div>

          <div className="mt-4 space-y-4">
            {isEditing ? (
              <div className="flex space-x-2">
                <Button
                  className="flex-1"
                  onClick={onSaveWidget}
                >
                  Save Widget
                </Button>
                <Button
                  variant="outline"
                  onClick={onCancelEditing}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <WidgetSubmissionForm
                widgetComponents={widgetComponents}
                apis={apis}
                widgetId={widgetId}
                onSubmitSuccess={onSubmitSuccess}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WidgetPreviewPanel;
