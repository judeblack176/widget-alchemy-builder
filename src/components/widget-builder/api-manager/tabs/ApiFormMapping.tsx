
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ApiConfig } from "@/types/api-types";

interface ApiFormMappingProps {
  newApi: Partial<ApiConfig>;
  setNewApi: React.Dispatch<React.SetStateAction<Partial<ApiConfig>>>;
  mappingKey: string;
  setMappingKey: (value: string) => void;
  mappingValue: string;
  setMappingValue: (value: string) => void;
  handleAddMapping: () => void;
}

const ApiFormMapping: React.FC<ApiFormMappingProps> = ({
  newApi,
  setNewApi,
  mappingKey,
  setMappingKey,
  mappingValue,
  setMappingValue,
  handleAddMapping
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>Response Data Mapping</Label>
        <span className="text-xs text-gray-500">Map component properties to API response data</span>
      </div>
      <div className="flex space-x-2">
        <Input
          placeholder="Component Property"
          value={mappingKey}
          onChange={(e) => setMappingKey(e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="API Response Field"
          value={mappingValue}
          onChange={(e) => setMappingValue(e.target.value)}
          className="flex-1"
        />
        <Button 
          type="button" 
          size="sm"
          onClick={handleAddMapping} 
          disabled={!mappingKey || !mappingValue}
        >
          Add
        </Button>
      </div>
      
      {newApi.possibleFields && newApi.possibleFields.length > 0 && (
        <div className="mt-2 p-2 bg-gray-50 rounded-md">
          <Label className="text-xs mb-1">Available Fields (click to use)</Label>
          <ScrollArea className="h-[100px]">
            <div className="flex flex-wrap gap-1">
              {newApi.possibleFields.map((field, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="font-mono text-xs cursor-pointer hover:bg-slate-100"
                  onClick={() => setMappingValue(field)}
                >
                  {field}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      
      {newApi.responseMapping && Object.keys(newApi.responseMapping).length > 0 && (
        <div className="mt-4 p-2 bg-gray-50 rounded-md text-sm">
          <Label className="text-xs mb-1">Current Mappings</Label>
          {Object.entries(newApi.responseMapping).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center py-1">
              <span className="font-mono">{key} → {value}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const newMapping = { ...newApi.responseMapping };
                  delete newMapping[key];
                  setNewApi({ ...newApi, responseMapping: newMapping });
                }}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiFormMapping;
