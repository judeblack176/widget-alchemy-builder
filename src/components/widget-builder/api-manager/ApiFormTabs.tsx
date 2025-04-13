
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApiFormGeneral from "./tabs/ApiFormGeneral";
import ApiFormHeaders from "./tabs/ApiFormHeaders";
import ApiFormParams from "./tabs/ApiFormParams";
import ApiFormSample from "./tabs/ApiFormSample";
import ApiFormMapping from "./tabs/ApiFormMapping";
import { ApiConfig } from "@/types/api-types";

interface ApiFormTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  newApi: Partial<ApiConfig>;
  setNewApi: React.Dispatch<React.SetStateAction<Partial<ApiConfig>>>;
  headerKey: string;
  setHeaderKey: (value: string) => void;
  headerValue: string;
  setHeaderValue: (value: string) => void;
  paramKey: string;
  setParamKey: (value: string) => void;
  paramValue: string;
  setParamValue: (value: string) => void;
  mappingKey: string;
  setMappingKey: (value: string) => void;
  mappingValue: string;
  setMappingValue: (value: string) => void;
  handleAddHeader: () => void;
  handleAddParam: () => void;
  handleAddMapping: () => void;
  processSampleResponse: () => void;
}

const ApiFormTabs: React.FC<ApiFormTabsProps> = ({
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
  processSampleResponse
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="headers">Headers</TabsTrigger>
        <TabsTrigger value="params">Parameters</TabsTrigger>
        <TabsTrigger value="sample">Sample Response</TabsTrigger>
        <TabsTrigger value="mapping">Response Mapping</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general" className="space-y-4 pt-4">
        <ApiFormGeneral 
          newApi={newApi} 
          setNewApi={setNewApi} 
        />
      </TabsContent>
      
      <TabsContent value="headers" className="space-y-4 pt-4">
        <ApiFormHeaders 
          newApi={newApi} 
          setNewApi={setNewApi}
          headerKey={headerKey}
          setHeaderKey={setHeaderKey}
          headerValue={headerValue}
          setHeaderValue={setHeaderValue}
          handleAddHeader={handleAddHeader}
        />
      </TabsContent>
      
      <TabsContent value="params" className="space-y-4 pt-4">
        <ApiFormParams 
          newApi={newApi} 
          setNewApi={setNewApi}
          paramKey={paramKey}
          setParamKey={setParamKey}
          paramValue={paramValue}
          setParamValue={setParamValue}
          handleAddParam={handleAddParam}
        />
      </TabsContent>
      
      <TabsContent value="sample" className="space-y-4 pt-4">
        <ApiFormSample
          newApi={newApi}
          setNewApi={setNewApi}
          processSampleResponse={processSampleResponse}
          setMappingValue={setMappingValue}
          setActiveTab={setActiveTab}
        />
      </TabsContent>
      
      <TabsContent value="mapping" className="space-y-4 pt-4">
        <ApiFormMapping
          newApi={newApi}
          setNewApi={setNewApi}
          mappingKey={mappingKey}
          setMappingKey={setMappingKey}
          mappingValue={mappingValue}
          setMappingValue={setMappingValue}
          handleAddMapping={handleAddMapping}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ApiFormTabs;
