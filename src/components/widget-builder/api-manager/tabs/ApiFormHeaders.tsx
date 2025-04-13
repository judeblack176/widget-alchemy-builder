
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ApiConfig } from "@/types/api-types";

interface ApiFormHeadersProps {
  newApi: Partial<ApiConfig>;
  setNewApi: React.Dispatch<React.SetStateAction<Partial<ApiConfig>>>;
  headerKey: string;
  setHeaderKey: (value: string) => void;
  headerValue: string;
  setHeaderValue: (value: string) => void;
  handleAddHeader: () => void;
}

const ApiFormHeaders: React.FC<ApiFormHeadersProps> = ({
  newApi,
  setNewApi,
  headerKey,
  setHeaderKey,
  headerValue,
  setHeaderValue,
  handleAddHeader
}) => {
  return (
    <div className="space-y-2">
      <Label>Headers</Label>
      <div className="flex space-x-2">
        <Input
          placeholder="Key"
          value={headerKey}
          onChange={(e) => setHeaderKey(e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Value"
          value={headerValue}
          onChange={(e) => setHeaderValue(e.target.value)}
          className="flex-1"
        />
        <Button 
          type="button" 
          size="sm"
          onClick={handleAddHeader} 
          disabled={!headerKey || !headerValue}
        >
          Add
        </Button>
      </div>
      
      {newApi.headers && Object.keys(newApi.headers).length > 0 && (
        <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm">
          {Object.entries(newApi.headers).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center py-1">
              <span className="font-mono">{key}: {value}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const newHeaders = { ...newApi.headers };
                  delete newHeaders[key];
                  setNewApi({ ...newApi, headers: newHeaders });
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

export default ApiFormHeaders;
