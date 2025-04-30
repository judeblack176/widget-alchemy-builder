
import React from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import ApiHeader from "./components/ApiHeader";
import ApiInfo from "./components/ApiInfo";
import ContentFieldSection from "./components/ContentFieldSection";
import { useApiFields } from "./hooks/useApiFields";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ApiDetailsViewProps {
  component: WidgetComponent;
  selectedApi?: ApiConfig;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
}

const ApiDetailsView: React.FC<ApiDetailsViewProps> = ({
  component,
  selectedApi,
  onUpdateComponent
}) => {
  if (!selectedApi) return null;

  const { availableApiFields, availableMappings } = useApiFields(selectedApi);

  const handleDisconnectApi = () => {
    const updatedComponent = { ...component };
    delete updatedComponent.apiConfig;
    onUpdateComponent(updatedComponent);
  };

  const handleDataMappingChange = (propKey: string, apiField: string) => {
    const updatedComponent = {
      ...component,
      apiConfig: {
        ...component.apiConfig!,
        dataMapping: {
          ...component.apiConfig?.dataMapping,
          [propKey]: apiField
        }
      }
    };
    onUpdateComponent(updatedComponent);
  };

  const handleMultiMappingChange = (propKey: string, apiField: string, isChecked: boolean) => {
    const currentFields = component.apiConfig?.multiMapping?.[propKey] || [];
    
    let updatedFields;
    if (isChecked) {
      updatedFields = [...currentFields, apiField];
    } else {
      updatedFields = currentFields.filter(field => field !== apiField);
    }
    
    const updatedComponent = {
      ...component,
      apiConfig: {
        ...component.apiConfig!,
        multiMapping: {
          ...component.apiConfig?.multiMapping,
          [propKey]: updatedFields
        }
      }
    };
    onUpdateComponent(updatedComponent);
  };

  // Prevent event propagation to stop container from closing
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Format sample response for display
  const formatSampleResponse = () => {
    if (!selectedApi.sampleResponse) return "No sample response available";
    try {
      const parsed = JSON.parse(selectedApi.sampleResponse);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return selectedApi.sampleResponse;
    }
  };

  return (
    <div className="space-y-4 mt-4 border rounded-md p-3 bg-gray-50" onClick={handleClick}>
      <ApiHeader 
        selectedApi={selectedApi}
        onDisconnectApi={handleDisconnectApi}
      />

      <ApiInfo selectedApi={selectedApi} />

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="response-mapping">
          <AccordionTrigger className="text-xs font-medium py-1">
            Response Mapping
            {selectedApi.responseMapping && Object.keys(selectedApi.responseMapping).length > 0 && (
              <Badge variant="outline" className="ml-2 text-xs">
                {Object.keys(selectedApi.responseMapping).length}
              </Badge>
            )}
          </AccordionTrigger>
          <AccordionContent>
            {selectedApi.responseMapping && Object.keys(selectedApi.responseMapping).length > 0 ? (
              <div className="space-y-1 text-xs">
                {Object.entries(selectedApi.responseMapping).map(([key, value], idx) => (
                  <div key={`mapping-${idx}`} className="flex items-center gap-2">
                    <span className="font-medium">{key}:</span>
                    <span className="text-gray-600 font-mono">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500">No response mappings defined</div>
            )}
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="sample-response">
          <AccordionTrigger className="text-xs font-medium py-1">
            Sample Response
          </AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-48 rounded border bg-gray-100 p-2">
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {formatSampleResponse()}
              </pre>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="available-fields">
          <AccordionTrigger className="text-xs font-medium py-1">
            Available Fields 
            {availableApiFields.length > 0 && (
              <Badge variant="outline" className="ml-2 text-xs">
                {availableApiFields.length}
              </Badge>
            )}
          </AccordionTrigger>
          <AccordionContent>
            {availableApiFields.length > 0 ? (
              <ScrollArea className="h-32">
                <div className="space-y-1 text-xs">
                  {availableApiFields.map((field, idx) => (
                    <div key={`field-${idx}`} className="text-gray-600 font-mono">
                      {field}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-xs text-gray-500">No fields available</div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <ContentFieldSection 
        component={component}
        availableApiFields={availableApiFields}
        availableMappings={availableMappings}
        onUpdateComponent={onUpdateComponent}
      />
    </div>
  );
};

export default ApiDetailsView;
