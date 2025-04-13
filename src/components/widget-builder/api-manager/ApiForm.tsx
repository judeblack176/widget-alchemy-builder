
import React from "react";
import { ApiConfig } from "@/types/api-types";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ApiFormTabs from "./ApiFormTabs";
import { useApiForm } from "./hooks/useApiForm";

interface ApiFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (api: ApiConfig) => void;
  selectedApiForEdit: string | null;
  existingApi?: ApiConfig;
}

const ApiForm: React.FC<ApiFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedApiForEdit,
  existingApi
}) => {
  const {
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
  } = useApiForm(onClose, (api) => {
    if (selectedApiForEdit) {
      onSubmit({
        ...(api as ApiConfig),
        id: selectedApiForEdit
      });
    } else {
      onSubmit({
        ...(api as ApiConfig),
        id: `api-${Date.now()}`
      });
    }
  });

  // Set form data when editing an existing API
  React.useEffect(() => {
    if (existingApi) {
      setNewApi(existingApi);
    }
  }, [existingApi, setNewApi]);

  if (!isOpen) return null;

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{selectedApiForEdit ? "Edit API Integration" : "Add New API Integration"}</DialogTitle>
        <DialogDescription>
          Configure an API endpoint to use with your widget components.
        </DialogDescription>
      </DialogHeader>
      
      <ApiFormTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        newApi={newApi}
        setNewApi={setNewApi}
        headerKey={headerKey}
        setHeaderKey={setHeaderKey}
        headerValue={headerValue}
        setHeaderValue={setHeaderValue}
        paramKey={paramKey}
        setParamKey={setParamKey}
        paramValue={paramValue}
        setParamValue={setParamValue}
        mappingKey={mappingKey}
        setMappingKey={setMappingKey}
        mappingValue={mappingValue}
        setMappingValue={setMappingValue}
        handleAddHeader={handleAddHeader}
        handleAddParam={handleAddParam}
        handleAddMapping={handleAddMapping}
        processSampleResponse={processSampleResponse}
      />
      
      <DialogFooter>
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button className="bg-widget-blue" onClick={handleSubmit}>
              {selectedApiForEdit ? "Update API" : "Add API"}
            </Button>
          </div>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

export default ApiForm;
