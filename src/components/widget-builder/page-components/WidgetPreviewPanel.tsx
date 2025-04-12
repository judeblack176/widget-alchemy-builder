
import React from 'react';
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import WidgetPreview from "@/components/widget-builder/WidgetPreview";
import WidgetSubmissionForm from "@/components/widget-builder/WidgetSubmissionForm";

interface WidgetPreviewPanelProps {
  widgetComponents: WidgetComponent[];
  apis: ApiConfig[];
  isEditing: boolean;
  widgetId: string | null;
  onSaveWidget: () => void;
  onCancelEditing: () => void;
  onSubmitSuccess: () => void;
}

const WidgetPreviewPanel: React.FC<WidgetPreviewPanelProps> = ({
  widgetComponents,
  apis,
  isEditing,
  widgetId,
  onSaveWidget,
  onCancelEditing,
  onSubmitSuccess
}) => {
  return (
    <div className="w-1/3 bg-gray-200 overflow-hidden flex flex-col">
      <div className="sticky top-0 z-40 bg-gray-200 p-4 border-b border-gray-300">
        <div className="flex justify-between items-center self-stretch mb-6">
          <h2 className="text-xl font-semibold">Preview</h2>
          <div className="space-x-2">
            {isEditing && (
              <Button
                onClick={onCancelEditing}
                variant="outline"
                size="default"
                className="border-red-500 text-red-500 hover:bg-red-50"
              >
                <X size={16} className="mr-2" /> Cancel
              </Button>
            )}
            <Button
              onClick={onSaveWidget}
              variant="default"
              size="default"
              className="bg-green-500 hover:bg-green-600 transition-colors"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto flex flex-col items-center justify-start pt-8 px-4">
        <WidgetPreview components={widgetComponents} apis={apis} />
        
        <div className="mt-6 mb-4">
          <WidgetSubmissionForm
            widgetComponents={widgetComponents}
            apis={apis}
            onSubmitSuccess={onSubmitSuccess}
            widgetId={widgetId}
            isEditing={isEditing}
            onCancelEditing={onCancelEditing}
          />
        </div>
      </div>
    </div>
  );
};

export default WidgetPreviewPanel;
