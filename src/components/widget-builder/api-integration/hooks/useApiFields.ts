
import { ApiConfig } from "@/types/api-types";

export const useApiFields = (selectedApi?: ApiConfig) => {
  const getAvailableApiFields = () => {
    if (!selectedApi) return [];
    
    // Use possibleFields if available, otherwise extract from sampleResponse
    if (selectedApi.possibleFields && selectedApi.possibleFields.length > 0) {
      return selectedApi.possibleFields;
    }
    
    // Try to parse sampleResponse if available
    if (selectedApi.sampleResponse) {
      try {
        const sampleData = JSON.parse(selectedApi.sampleResponse);
        // Get all top-level keys
        return Object.keys(sampleData);
      } catch (e) {
        return [];
      }
    }
    
    return [];
  };

  const getAvailableMappings = () => {
    return [
      "content",
      "title",
      "description",
      "data",
      "items",
      "message",
      "status",
      "result"
    ];
  };

  return {
    availableApiFields: getAvailableApiFields(),
    availableMappings: getAvailableMappings()
  };
};
