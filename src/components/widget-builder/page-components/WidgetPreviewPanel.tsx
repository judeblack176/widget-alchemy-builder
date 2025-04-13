
import React from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WidgetPreview from '@/components/widget-builder/WidgetPreview';
import WidgetSubmissionForm from '@/components/widget-builder/WidgetSubmissionForm';
import { Tooltip } from '../TooltipManager';

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

          {isEditing && (
            <div className="mt-4">
              <Tabs defaultValue="save">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="save">Save</TabsTrigger>
                  <TabsTrigger value="submit">Submit</TabsTrigger>
                </TabsList>
                <TabsContent value="save" className="pt-4">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Save your widget to continue editing later.
                    </p>
                    <div className="flex space-x-2">
                      <button
                        className="flex-1 px-3 py-2 bg-primary text-white rounded hover:bg-primary/90"
                        onClick={onSaveWidget}
                      >
                        Save Widget
                      </button>
                      <button
                        className="px-3 py-2 border rounded hover:bg-gray-50"
                        onClick={onCancelEditing}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="submit" className="pt-4">
                  <WidgetSubmissionForm
                    components={widgetComponents}
                    apis={apis}
                    widgetId={widgetId}
                    onSubmitSuccess={onSubmitSuccess}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WidgetPreviewPanel;
