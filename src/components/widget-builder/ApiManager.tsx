
import React, { useState } from "react";
import { ApiConfig } from "@/types/api-types";
import { Dialog } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Globe } from "lucide-react";
import { ApiHeader, ApiSearch, ApiTable, EmptyApiState, ApiForm } from "./api-manager";
import { useApiTable } from "./api-manager/hooks/useApiTable";

interface ApiManagerProps {
  apis: ApiConfig[];
  onAddApi: (api: ApiConfig) => void;
  onRemoveApi: (apiId: string) => void;
  onUpdateApi?: (apiId: string, updatedApi: ApiConfig) => void;
}

const ApiManager: React.FC<ApiManagerProps> = ({ 
  apis, 
  onAddApi, 
  onRemoveApi, 
  onUpdateApi 
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedApiForEdit, setSelectedApiForEdit] = useState<string | null>(null);
  
  const {
    searchQuery,
    sortDirection,
    copyStatus,
    handleSearch,
    toggleSort,
    copyApiToClipboard,
    filterAndSortApis
  } = useApiTable();

  const createSampleApi = () => {
    const sampleApi: ApiConfig = {
      id: `api-sample-${Date.now()}`,
      name: "Weather API",
      endpoint: "https://api.weatherapi.com/v1/current.json",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer api-key-goes-here"
      },
      parameters: {
        "q": "London",
        "units": "metric"
      },
      responseMapping: {
        "temperature": "current.temp_c",
        "condition": "current.condition.text",
        "location": "location.name",
        "country": "location.country"
      },
      sampleResponse: JSON.stringify({
        "location": {
          "name": "London",
          "region": "City of London, Greater London",
          "country": "United Kingdom",
          "lat": 51.52,
          "lon": -0.11,
          "localtime": "2023-04-12 15:30"
        },
        "current": {
          "temp_c": 18.0,
          "temp_f": 64.4,
          "condition": {
            "text": "Partly cloudy",
            "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png"
          },
          "wind_mph": 6.9,
          "humidity": 73,
          "cloud": 75,
          "feelslike_c": 18.0,
          "uv": 4.0
        }
      }, null, 2),
      possibleFields: [
        "location.name",
        "location.region",
        "location.country",
        "location.lat",
        "location.lon",
        "location.localtime",
        "current.temp_c",
        "current.temp_f",
        "current.condition.text",
        "current.condition.icon",
        "current.wind_mph",
        "current.humidity",
        "current.cloud",
        "current.feelslike_c",
        "current.uv"
      ]
    };
    
    onAddApi(sampleApi);
    
    toast({
      title: "Sample API Added",
      description: "The sample Weather API has been added to your configuration."
    });
  };

  const handleEditApi = (apiId: string) => {
    setSelectedApiForEdit(apiId);
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedApiForEdit(null);
    setIsOpen(false);
  };

  const handleSubmitApi = (api: ApiConfig) => {
    if (selectedApiForEdit) {
      onUpdateApi && onUpdateApi(selectedApiForEdit, api);
    } else {
      onAddApi(api);
    }
  };

  const filteredAndSortedApis = filterAndSortApis(apis);
  const selectedApi = selectedApiForEdit ? apis.find(api => api.id === selectedApiForEdit) : undefined;

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="sticky top-0 bg-white z-10 pb-4 space-y-4">
        <ApiHeader 
          onCreateSampleApi={createSampleApi}
          setIsDialogOpen={setIsOpen}
        />
        
        <ApiSearch 
          onSearch={handleSearch}
          sortDirection={sortDirection}
          toggleSort={toggleSort}
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-2">
          {apis.length === 0 ? (
            <EmptyApiState />
          ) : filteredAndSortedApis.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <Globe className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-500">No matching APIs found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search query</p>
            </div>
          ) : (
            <ApiTable 
              apis={filteredAndSortedApis}
              copyStatus={copyStatus}
              onCopy={copyApiToClipboard}
              onEdit={handleEditApi}
              onRemove={onRemoveApi}
            />
          )}
        </ScrollArea>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <ApiForm 
          isOpen={isOpen}
          onClose={handleCloseDialog}
          onSubmit={handleSubmitApi}
          selectedApiForEdit={selectedApiForEdit}
          existingApi={selectedApi}
        />
      </Dialog>
    </div>
  );
};

export default ApiManager;
