
import { ApiConfig } from "@/types/api-types";

/**
 * Extracts field paths from a JSON object
 */
export const extractFieldPaths = (obj: any, prefix = ''): string[] => {
  if (!obj || typeof obj !== 'object') return [];
  
  let paths: string[] = [];
  
  Object.entries(obj).forEach(([key, value]) => {
    const newPath = prefix ? `${prefix}.${key}` : key;
    paths.push(newPath);
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      paths = [...paths, ...extractFieldPaths(value, newPath)];
    } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      paths.push(`${newPath}[0]`);
      paths = [...paths, ...extractFieldPaths(value[0], `${newPath}[0]`)];
    }
  });
  
  return paths;
};

/**
 * Processes an API object to extract fields from sample response
 */
export const processApiObject = (api: ApiConfig): ApiConfig => {
  let processedApi = {...api};
  
  if (api.sampleResponse) {
    try {
      const jsonData = JSON.parse(api.sampleResponse);
      processedApi.possibleFields = extractFieldPaths(jsonData);
    } catch (error) {
      console.error("Failed to parse sample response", error);
    }
  }
  
  return processedApi;
};
