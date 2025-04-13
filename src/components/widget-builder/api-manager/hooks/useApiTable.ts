
import { useState } from "react";
import { ApiConfig } from "@/types/api-types";
import { useToast } from "@/hooks/use-toast";

export const useApiTable = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const [copyStatus, setCopyStatus] = useState<{[key: string]: boolean}>({});

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleSort = () => {
    setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
  };

  const copyApiToClipboard = (api: ApiConfig) => {
    const apiData = {
      name: api.name,
      endpoint: api.endpoint,
      method: api.method,
      headers: api.headers,
      parameters: api.parameters,
      responseMapping: api.responseMapping
    };
    
    navigator.clipboard.writeText(JSON.stringify(apiData, null, 2))
      .then(() => {
        setCopyStatus({...copyStatus, [api.id]: true});
        setTimeout(() => {
          setCopyStatus({...copyStatus, [api.id]: false});
        }, 2000);
        
        toast({
          title: "API Copied",
          description: "API configuration copied to clipboard",
        });
      })
      .catch(() => {
        toast({
          title: "Copy Failed",
          description: "Failed to copy API configuration",
          variant: "destructive"
        });
      });
  };

  const filterAndSortApis = (apis: ApiConfig[]) => {
    return apis
      .filter(api => 
        api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        api.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
        api.method.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortDirection === 'asc') {
          return a.name.localeCompare(b.name);
        } else if (sortDirection === 'desc') {
          return b.name.localeCompare(a.name);
        } else {
          return 0;
        }
      });
  };

  return {
    searchQuery,
    sortDirection,
    copyStatus,
    handleSearch,
    toggleSort,
    copyApiToClipboard,
    filterAndSortApis
  };
};
