
import React from 'react';
import { ApiConfig } from "@/types/widget-types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { BookmarkIcon } from 'lucide-react';

interface ApiTemplateModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  apiTemplates: ApiConfig[];
  onApplyTemplate: (template: ApiConfig) => void;
}

const ApiTemplateModal: React.FC<ApiTemplateModalProps> = ({
  isOpen,
  onOpenChange,
  apiTemplates,
  onApplyTemplate
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Select API Template</DialogTitle>
        </DialogHeader>
        
        {apiTemplates.length === 0 ? (
          <div className="text-center py-8">
            <BookmarkIcon className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-gray-500">No saved API templates yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Save your APIs as templates from the API tab to reuse them
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
              {apiTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="cursor-pointer hover:border-widget-blue transition-colors"
                  onClick={() => onApplyTemplate(template)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-1">
                      <div className="flex">
                        <span className="font-semibold w-20">Method:</span>
                        <span className="font-mono text-widget-blue">{template.method}</span>
                      </div>
                      <div className="flex">
                        <span className="font-semibold w-20">Endpoint:</span>
                        <span className="font-mono text-xs truncate" title={template.endpoint}>
                          {template.endpoint}
                        </span>
                      </div>
                      {template.possibleFields && template.possibleFields.length > 0 && (
                        <div className="mt-2">
                          <span className="font-semibold text-xs block mb-1">Available Fields:</span>
                          <div className="flex flex-wrap gap-1">
                            {template.possibleFields.slice(0, 3).map((field, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{field}</Badge>
                            ))}
                            {template.possibleFields.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{template.possibleFields.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiTemplateModal;
