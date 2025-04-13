
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ApiConfig } from "@/types/api-types";

interface ApiFormParamsProps {
  newApi: Partial<ApiConfig>;
  setNewApi: React.Dispatch<React.SetStateAction<Partial<ApiConfig>>>;
  paramKey: string;
  setParamKey: (value: string) => void;
  paramValue: string;
  setParamValue: (value: string) => void;
  handleAddParam: () => void;
}

const ApiFormParams: React.FC<ApiFormParamsProps> = ({
  newApi,
  setNewApi,
  paramKey,
  setParamKey,
  paramValue,
  setParamValue,
  handleAddParam
}) => {
  return (
    <div className="space-y-2">
      <Label>Parameters</Label>
      <div className="flex space-x-2">
        <Input
          placeholder="Key"
          value={paramKey}
          onChange={(e) => setParamKey(e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Value"
          value={paramValue}
          onChange={(e) => setParamValue(e.target.value)}
          className="flex-1"
        />
        <Button 
          type="button" 
          size="sm"
          onClick={handleAddParam} 
          disabled={!paramKey || !paramValue}
        >
          Add
        </Button>
      </div>
      
      {newApi.parameters && Object.keys(newApi.parameters).length > 0 && (
        <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm">
          {Object.entries(newApi.parameters).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center py-1">
              <span className="font-mono">{key}: {value}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const newParams = { ...newApi.parameters };
                  delete newParams[key];
                  setNewApi({ ...newApi, parameters: newParams });
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

export default ApiFormParams;
