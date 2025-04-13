
import React from "react";
import { ApiConfig } from "@/types/widget-types";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ApiInfoProps {
  selectedApi: ApiConfig;
}

const ApiInfo: React.FC<ApiInfoProps> = ({ selectedApi }) => {
  return (
    <>
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium w-20">Endpoint:</span>
          <span className="text-xs overflow-hidden overflow-ellipsis">{selectedApi.endpoint}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium w-20">Method:</span>
          <Badge variant="outline" className="text-xs font-mono">
            {selectedApi.method}
          </Badge>
        </div>
      </div>

      {/* Parameters */}
      {selectedApi.parameters && Object.keys(selectedApi.parameters).length > 0 && (
        <div className="mt-1">
          <Accordion type="single" collapsible>
            <AccordionItem value="parameters">
              <AccordionTrigger className="text-xs font-medium py-1">
                Parameters
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1 text-xs">
                  {Object.entries(selectedApi.parameters).map(([key, value], idx) => (
                    <div key={`param-${idx}`} className="flex items-center gap-2">
                      <span className="font-medium">{key}:</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </>
  );
};

export default ApiInfo;
