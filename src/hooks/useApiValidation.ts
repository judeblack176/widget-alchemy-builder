
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook for handling API validation logic
 */
export const useApiValidation = (widgetComponents: WidgetComponent[]) => {
  const { toast } = useToast();
  
  const validateApiRemoval = (apiId: string): boolean => {
    const componentsUsingApi = widgetComponents.filter(comp => comp.apiConfig?.apiId === apiId);
    
    if (componentsUsingApi.length > 0) {
      toast({
        title: "Cannot Remove API",
        description: `This API is being used by ${componentsUsingApi.length} component(s). Please remove the API integration from these components first.`,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
  return { validateApiRemoval };
};
