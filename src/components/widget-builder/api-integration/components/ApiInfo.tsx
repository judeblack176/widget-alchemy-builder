
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
          <span className="text-xs font-mono overflow-hidden overflow-ellipsis">{selectedApi.endpoint}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium w-20">Method:</span>
          <Badge 
            variant="outline" 
            className={`
              text-xs font-mono
              ${selectedApi.method === 'GET' ? 'border-green-500 bg-green-50 text-green-700' : ''}
              ${selectedApi.method === 'POST' ? 'border-blue-500 bg-blue-50 text-blue-700' : ''}
              ${selectedApi.method === 'PUT' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : ''}
              ${selectedApi.method === 'DELETE' ? 'border-red-500 bg-red-50 text-red-700' : ''}
            `}
          >
            {selectedApi.method}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium w-20">Headers:</span>
          <span className="text-xs">
            {selectedApi.headers && Object.keys(selectedApi.headers).length > 0 ? 
              `${Object.keys(selectedApi.headers).length} defined` : 
              'None'
            }
          </span>
        </div>
      </div>

      {/* Parameters */}
      {selectedApi.parameters && Object.keys(selectedApi.parameters).length > 0 && (
        <div className="mt-3">
          <Accordion type="single" collapsible>
            <AccordionItem value="parameters">
              <AccordionTrigger className="text-xs font-medium py-1">
                Parameters
                <Badge variant="outline" className="ml-2 text-xs">
                  {Object.keys(selectedApi.parameters).length}
                </Badge>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1 text-xs">
                  {Object.entries(selectedApi.parameters).map(([key, value], idx) => (
                    <div key={`param-${idx}`} className="flex items-center gap-2">
                      <span className="font-medium">{key}:</span>
                      <span className="text-gray-600 font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
      
      {/* Headers Detailed View */}
      {selectedApi.headers && Object.keys(selectedApi.headers).length > 0 && (
        <div className="mt-1">
          <Accordion type="single" collapsible>
            <AccordionItem value="headers">
              <AccordionTrigger className="text-xs font-medium py-1">
                Headers
                <Badge variant="outline" className="ml-2 text-xs">
                  {Object.keys(selectedApi.headers).length}
                </Badge>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1 text-xs">
                  {Object.entries(selectedApi.headers).map(([key, value], idx) => (
                    <div key={`header-${idx}`} className="flex items-center gap-2">
                      <span className="font-medium">{key}:</span>
                      <span className="text-gray-600 font-mono">
                        {key.toLowerCase() === 'authorization' ? 
                          value.substring(0, 15) + '...' : 
                          value}
                      </span>
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
