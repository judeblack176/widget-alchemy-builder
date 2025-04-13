
import React from "react";
import { Button } from "@/components/ui/button";
import { SortAsc, SortDesc } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SearchBar from "@/components/widget-builder/SearchBar";

interface ApiSearchProps {
  onSearch: (query: string) => void;
  sortDirection: "asc" | "desc" | null;
  toggleSort: () => void;
}

const ApiSearch: React.FC<ApiSearchProps> = ({
  onSearch,
  sortDirection,
  toggleSort
}) => {
  return (
    <div className="flex gap-2 mb-2">
      <SearchBar 
        onSearch={onSearch} 
        placeholder="Search APIs..." 
        className="flex-1"
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              onClick={toggleSort}
              className="flex items-center justify-center"
            >
              {sortDirection === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sort {sortDirection === 'asc' ? 'A to Z' : 'Z to A'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ApiSearch;
