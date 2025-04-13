
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ApiConfig } from "@/types/widget-types";
import { WidgetComponent } from "@/types/widget-types";
import { processApiObject } from "@/utils/api-processing";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useApiValidation } from "@/hooks/useApiValidation";

export const useApiState = (widgetComponents: WidgetComponent[]) => {
  const { toast } = useToast();
  const [apis, setApis] = useState<ApiConfig[]>([]);
  const [savedApiTemplates, setSavedApiTemplates] = useLocalStorage<ApiConfig[]>('savedApiTemplates', []);
  const { validateApiRemoval } = useApiValidation(widgetComponents);
  
  const handleAddApi = (api: ApiConfig) => {
    const processedApi = processApiObject(api);
    
    setApis([...apis, processedApi]);
    toast({
      title: "API Added",
      description: `Added API: ${api.name}`
    });
  };

  const handleUpdateApi = (apiId: string, updatedApi: ApiConfig) => {
    const processedApi = processApiObject(updatedApi);
    
    setApis(apis.map(api => api.id === apiId ? processedApi : api));
    
    toast({
      title: "API Updated",
      description: `Updated API: ${updatedApi.name}`
    });
  };

  const handleRemoveApi = (apiId: string) => {
    if (!validateApiRemoval(apiId)) return;
    
    setApis(apis.filter(api => api.id !== apiId));
    toast({
      title: "API Removed",
      description: "The API has been removed from your widget."
    });
  };

  return {
    apis,
    setApis,
    savedApiTemplates,
    handleAddApi,
    handleUpdateApi,
    handleRemoveApi
  };
};
