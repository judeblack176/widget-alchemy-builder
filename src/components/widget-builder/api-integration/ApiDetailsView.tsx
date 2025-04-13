
import React from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import ApiHeader from "./components/ApiHeader";
import ApiInfo from "./components/ApiInfo";
import ContentFieldSection from "./components/ContentFieldSection";
import { useApiFields } from "./hooks/useApiFields";

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

  return (
    <div className="space-y-4 mt-4 border rounded-md p-3 bg-gray-50">
      <ApiHeader 
        selectedApi={selectedApi}
        onDisconnectApi={handleDisconnectApi}
      />

      <ApiInfo selectedApi={selectedApi} />

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
