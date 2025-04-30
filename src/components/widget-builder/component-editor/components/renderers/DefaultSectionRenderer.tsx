
import React from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Tooltip } from "@/components/widget-builder/TooltipManager";
import { Badge } from "@/components/ui/badge";
import { InfoIcon } from "lucide-react";
import ApiIntegrationSection from "../../../api-integration/ApiIntegrationSection";
import ContentFieldsManager from "../../../content-fields/ContentFieldsManager";
import PropertyEditor from "../../../property-editor/PropertyEditor";
import TooltipSelector from "../../../tooltip/TooltipSelector";

interface DefaultSectionRendererProps {
  component: WidgetComponent;
  apis: ApiConfig[];
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRequestApiTemplate: () => void;
  onApplyTooltip?: (tooltipId: string) => void;
  customTooltips?: Tooltip[];
  shouldShowDataIntegration: () => boolean;
  shouldShowContentEditor: () => boolean;
  skipPropertyEditor?: boolean;
}

const DefaultSectionRenderer: React.FC<DefaultSectionRendererProps> = ({
  component,
  apis,
  onUpdateComponent,
  onRequestApiTemplate,
  onApplyTooltip,
  customTooltips = [],
  shouldShowDataIntegration,
  shouldShowContentEditor,
  skipPropertyEditor = false
}) => {
  // Get the connected API if it exists
  const connectedApi = component.apiConfig 
    ? apis.find(api => api.id === component.apiConfig?.apiId)
    : undefined;

  return (
    <>
      {shouldShowDataIntegration() && (
        <div className="mb-4">
          {component.apiConfig && connectedApi && (
            <div className="mb-2 px-2 py-1 bg-blue-50 border border-blue-100 rounded-md flex items-center">
              <InfoIcon size={14} className="text-blue-500 mr-2" />
              <span className="text-xs text-blue-700">
                Connected to API: <span className="font-medium">{connectedApi.name}</span>
              </span>
              <Badge 
                variant="outline" 
                className={`
                  ml-2 text-xs
                  ${connectedApi.method === 'GET' ? 'border-green-500 bg-green-50 text-green-700' : ''}
                  ${connectedApi.method === 'POST' ? 'border-blue-500 bg-blue-50 text-blue-700' : ''}
                  ${connectedApi.method === 'PUT' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : ''}
                  ${connectedApi.method === 'DELETE' ? 'border-red-500 bg-red-50 text-red-700' : ''}
                `}
              >
                {connectedApi.method}
              </Badge>
            </div>
          )}
          
          <ApiIntegrationSection 
            component={component}
            apis={apis}
            onUpdateComponent={onUpdateComponent}
            onRequestApiTemplate={onRequestApiTemplate}
          />
        </div>
      )}
      
      {shouldShowContentEditor() && (
        <ContentFieldsManager 
          component={component}
          onUpdateComponent={onUpdateComponent}
        />
      )}
      
      {/* Only show property editor if not skipped */}
      {!skipPropertyEditor && (
        <PropertyEditor 
          component={component}
          onUpdateComponent={onUpdateComponent}
        />
      )}
      
      {onApplyTooltip && (
        <TooltipSelector 
          component={component}
          customTooltips={customTooltips}
          onApplyTooltip={onApplyTooltip}
        />
      )}
    </>
  );
};

export default DefaultSectionRenderer;
