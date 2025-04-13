
import React from "react";
import { ApiConfig } from "@/types/api-types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, Code, Trash2, Search } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ApiTableProps {
  apis: ApiConfig[];
  copyStatus: {[key: string]: boolean};
  onCopy: (api: ApiConfig) => void;
  onEdit: (apiId: string) => void;
  onRemove: (apiId: string) => void;
}

const ApiTable: React.FC<ApiTableProps> = ({ 
  apis, 
  copyStatus, 
  onCopy, 
  onEdit, 
  onRemove 
}) => {
  if (apis.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <Search className="mx-auto text-gray-400 mb-2" size={32} />
        <p className="text-gray-500">No matching APIs found</p>
        <p className="text-sm text-gray-400 mt-1">Try adjusting your search query</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] p-2">API Name</TableHead>
            <TableHead className="p-2">Details</TableHead>
            <TableHead className="text-right w-[100px] p-2">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apis.map((api) => (
            <TableRow key={api.id}>
              <TableCell className="font-medium p-2">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`
                      ${api.method === 'GET' ? 'border-green-500 bg-green-50 text-green-700' : ''}
                      ${api.method === 'POST' ? 'border-blue-500 bg-blue-50 text-blue-700' : ''}
                      ${api.method === 'PUT' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : ''}
                      ${api.method === 'DELETE' ? 'border-red-500 bg-red-50 text-red-700' : ''}
                      text-xs px-1.5 py-0.5
                    `}
                  >
                    {api.method}
                  </Badge>
                  <span className="text-sm truncate max-w-[150px]">{api.name}</span>
                </div>
              </TableCell>
              <TableCell className="p-2">
                <div className="text-xs space-y-1">
                  <div className="flex items-center">
                    <span className="font-semibold w-20 mr-2">Endpoint:</span>
                    <span className="font-mono truncate max-w-[200px]" title={api.endpoint}>
                      {api.endpoint}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="font-semibold w-20 mr-2">Headers:</span>
                    <span className="text-xs">
                      {Object.keys(api.headers || {}).length || 'None'}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="font-semibold w-20 mr-2">Mappings:</span>
                    <span className="text-xs">
                      {Object.keys(api.responseMapping || {}).length || 'None'}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right p-2">
                <div className="flex justify-end gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-1"
                          onClick={() => onCopy(api)}
                        >
                          {copyStatus[api.id] ? <Check size={14} /> : <Copy size={14} />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy API configuration</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-1"
                          onClick={() => onEdit(api.id)}
                        >
                          <Code size={14} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit API</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-1" 
                          onClick={() => onRemove(api.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove API</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApiTable;
