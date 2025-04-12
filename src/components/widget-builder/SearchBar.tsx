
import React, { useState } from 'react';
import { Search, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  iconColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  showIcon?: boolean;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTagFilterClick?: () => void;
  showTagFilter?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search...",
  iconColor = "#6B7280",
  backgroundColor = "#FFFFFF",
  textColor,
  borderColor,
  showIcon = true,
  className = "w-full",
  value,
  onChange,
  onTagFilterClick,
  showTagFilter = false
}) => {
  const [query, setQuery] = useState('');
  
  const isControlled = value !== undefined && onChange !== undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    
    if (isControlled) {
      onChange(e);
    } else {
      setQuery(newQuery);
    }
    
    onSearch(newQuery);
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      {showIcon && (
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" 
          style={{ color: iconColor }}
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={isControlled ? value : query}
        onChange={handleChange}
        className={`${showIcon ? 'pl-10' : 'pl-4'} ${showTagFilter ? 'pr-10' : ''} shadow-sm`}
        style={{
          backgroundColor: backgroundColor,
          color: textColor,
          borderColor: borderColor
        }}
      />
      
      {showTagFilter && onTagFilterClick && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                onClick={onTagFilterClick}
              >
                <Tag className="h-4 w-4" style={{ color: iconColor }} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Filter by tags</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default SearchBar;
