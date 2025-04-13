
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiConfig } from "@/types/api-types";

interface ApiFormGeneralProps {
  newApi: Partial<ApiConfig>;
  setNewApi: React.Dispatch<React.SetStateAction<Partial<ApiConfig>>>;
}

const ApiFormGeneral: React.FC<ApiFormGeneralProps> = ({ newApi, setNewApi }) => {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="api-name">API Name</Label>
        <Input
          id="api-name"
          value={newApi.name || ''}
          onChange={(e) => setNewApi({ ...newApi, name: e.target.value })}
          placeholder="Enter a descriptive name"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="api-endpoint">Endpoint URL</Label>
        <Input
          id="api-endpoint"
          value={newApi.endpoint || ''}
          onChange={(e) => setNewApi({ ...newApi, endpoint: e.target.value })}
          placeholder="https://api.example.com/data"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="api-method">HTTP Method</Label>
        <Select
          value={newApi.method}
          onValueChange={(value) => setNewApi({ ...newApi, method: value as any })}
        >
          <SelectTrigger id="api-method">
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default ApiFormGeneral;
