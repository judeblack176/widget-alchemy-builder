
export interface ApiConfig {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  parameters?: Record<string, string>;
  responseMapping?: Record<string, string>;
  sampleResponse?: string;
  possibleFields?: string[];
}

export const extractFieldPaths = (obj: any, prefix = ''): string[] => {
  if (!obj || typeof obj !== 'object') return [];
  
  let paths: string[] = [];
  
  Object.entries(obj).forEach(([key, value]) => {
    const newPath = prefix ? `${prefix}.${key}` : key;
    paths.push(newPath);
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // For nested objects, recurse deeper
      paths = [...paths, ...extractFieldPaths(value, newPath)];
    } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      // For arrays of objects, show array notation and recurse into the first item
      paths.push(`${newPath}[0]`);
      paths = [...paths, ...extractFieldPaths(value[0], `${newPath}[0]`)];
    }
  });
  
  return paths;
};
