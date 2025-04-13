
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ApiConfig } from "@/types/api-types";

interface ApiFormSampleProps {
  newApi: Partial<ApiConfig>;
  setNewApi: React.Dispatch<React.SetStateAction<Partial<ApiConfig>>>;
  processSampleResponse: () => void;
  setMappingValue: (value: string) => void;
  setActiveTab: (tab: string) => void;
}

const ApiFormSample: React.FC<ApiFormSampleProps> = ({
  newApi,
  setNewApi,
  processSampleResponse,
  setMappingValue,
  setActiveTab
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>Sample API Response</Label>
        <Button 
          type="button" 
          size="sm" 
          onClick={processSampleResponse}
          variant="outline"
        >
          <UploadCloud size={14} className="mr-1" /> Process Response
        </Button>
      </div>
      <Textarea 
        placeholder="Paste a sample JSON response from this API"
        value={newApi.sampleResponse || ''}
        onChange={(e) => setNewApi({ ...newApi, sampleResponse: e.target.value })}
        className="min-h-[200px] font-mono text-sm"
      />
      
      {newApi.possibleFields && newApi.possibleFields.length > 0 && (
        <div className="mt-4 space-y-2">
          <Label>Available Fields</Label>
          <ScrollArea className="h-[150px] border rounded-md p-2">
            <div className="flex flex-wrap gap-2">
              {newApi.possibleFields.map((field, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="font-mono text-xs cursor-pointer hover:bg-slate-100"
                  onClick={() => {
                    setMappingValue(field);
                    setActiveTab("mapping");
                  }}
                >
                  {field}
                </Badge>
              ))}
            </div>
          </ScrollArea>
          <p className="text-xs text-gray-500">
            Click on a field to use it in response mapping
          </p>
        </div>
      )}
    </div>
  );
};

export default ApiFormSample;
