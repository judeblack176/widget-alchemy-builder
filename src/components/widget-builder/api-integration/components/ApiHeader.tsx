
import React from "react";
import { ApiConfig } from "@/types/widget-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ApiHeaderProps {
  selectedApi: ApiConfig;
  onDisconnectApi: () => void;
}

const ApiHeader: React.FC<ApiHeaderProps> = ({ selectedApi, onDisconnectApi }) => {
  return (
    <div className="flex justify-between items-center">
      <h4 className="font-medium text-sm">Connected to: {selectedApi.name}</h4>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onDisconnectApi}
        className="h-6 text-red-500 hover:text-red-700"
      >
        <X size={14} className="mr-1" /> Disconnect
      </Button>
    </div>
  );
};

export default ApiHeader;
