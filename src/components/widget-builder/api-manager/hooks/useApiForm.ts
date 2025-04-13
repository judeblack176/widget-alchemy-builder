
import { useState } from "react";
import { ApiConfig } from "@/types/api-types";
import { useToast } from "@/hooks/use-toast";

export const useApiForm = (
  onClose: () => void, 
  onSubmit: (api: Partial<ApiConfig>) => void
) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [headerKey, setHeaderKey] = useState("");
  const [headerValue, setHeaderValue] = useState("");
  const [paramKey, setParamKey] = useState("");
  const [paramValue, setParamValue] = useState("");
  const [mappingKey, setMappingKey] = useState("");
  const [mappingValue, setMappingValue] = useState("");
  
  const [newApi, setNewApi] = useState<Partial<ApiConfig>>({
    name: "",
    endpoint: "",
    method: "GET",
    headers: {},
    parameters: {},
    responseMapping: {},
    sampleResponse: "",
    possibleFields: []
  });

  const handleAddHeader = () => {
    if (headerKey && headerValue) {
      setNewApi({
        ...newApi,
        headers: { ...(newApi.headers || {}), [headerKey]: headerValue }
      });
      setHeaderKey("");
      setHeaderValue("");
    }
  };

  const handleAddParam = () => {
    if (paramKey && paramValue) {
      setNewApi({
        ...newApi,
        parameters: { ...(newApi.parameters || {}), [paramKey]: paramValue }
      });
      setParamKey("");
      setParamValue("");
    }
  };
  
  const handleAddMapping = () => {
    if (mappingKey && mappingValue) {
      setNewApi({
        ...newApi,
        responseMapping: { ...(newApi.responseMapping || {}), [mappingKey]: mappingValue }
      });
      setMappingKey("");
      setMappingValue("");
    }
  };

  const processSampleResponse = () => {
    if (!newApi.sampleResponse) return;
    
    try {
      const jsonData = JSON.parse(newApi.sampleResponse);
      const extractedFields = extractFieldPaths(jsonData);
      
      setNewApi({
        ...newApi,
        possibleFields: extractedFields
      });
      
      toast({
        title: "Fields Extracted",
        description: `Successfully extracted ${extractedFields.length} possible fields from the sample response.`
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please enter valid JSON for the sample response.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setNewApi({
      name: "",
      endpoint: "",
      method: "GET",
      headers: {},
      parameters: {},
      responseMapping: {},
      sampleResponse: "",
      possibleFields: []
    });
    setHeaderKey("");
    setHeaderValue("");
    setParamKey("");
    setParamValue("");
    setMappingKey("");
    setMappingValue("");
    setActiveTab("general");
  };

  const handleSubmit = () => {
    if (newApi.name && newApi.endpoint && newApi.method) {
      onSubmit(newApi);
      resetForm();
      onClose();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return {
    activeTab,
    setActiveTab,
    newApi,
    setNewApi,
    headerKey,
    setHeaderKey,
    headerValue,
    setHeaderValue,
    paramKey,
    setParamKey,
    paramValue,
    setParamValue,
    mappingKey,
    setMappingKey,
    mappingValue,
    setMappingValue,
    handleAddHeader,
    handleAddParam,
    handleAddMapping,
    processSampleResponse,
    handleSubmit,
    handleClose
  };
};

// Helper function to extract field paths from JSON data
const extractFieldPaths = (obj: any, prefix = ''): string[] => {
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
