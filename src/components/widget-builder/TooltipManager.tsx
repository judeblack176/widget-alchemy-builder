
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, FileSpreadsheet, SortAsc, SortDesc, Search, Tag, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SearchBar from '@/components/widget-builder/SearchBar';
import { COMMON_TOOLTIP_TAGS } from '@/types/widget-types';

export interface Tooltip {
  id: string;
  title: string;
  content: string;
  tags?: string[];
}

interface TooltipManagerProps {
  tooltips: Tooltip[];
  onAddTooltip: (tooltip: Tooltip) => void;
  onUpdateTooltip: (tooltipId: string, tooltip: Tooltip) => void;
  onRemoveTooltip: (tooltipId: string) => void;
}

const TooltipManager: React.FC<TooltipManagerProps> = ({
  tooltips,
  onAddTooltip,
  onUpdateTooltip,
  onRemoveTooltip
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [currentTooltip, setCurrentTooltip] = useState<Tooltip | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  useEffect(() => {
    if (currentTooltip) {
      setTags(currentTooltip.tags || []);
    } else {
      setTags([]);
    }
  }, [currentTooltip]);

  const handleAddNewTooltip = () => {
    setCurrentTooltip(null);
    setTitle('');
    setContent('');
    setTags([]);
    setIsEditing(true);
  };

  const handleEditTooltip = (tooltip: Tooltip) => {
    setCurrentTooltip(tooltip);
    setTitle(tooltip.title);
    setContent(tooltip.content);
    setTags(tooltip.tags || []);
    setIsEditing(true);
  };

  const handleSaveTooltip = () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please provide a title for the tooltip.",
        variant: "destructive"
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please provide content for the tooltip.",
        variant: "destructive"
      });
      return;
    }

    const tooltipData: Tooltip = {
      id: currentTooltip?.id || `tooltip-${Date.now()}`,
      title,
      content,
      tags
    };

    if (currentTooltip) {
      onUpdateTooltip(currentTooltip.id, tooltipData);
      toast({
        title: "Tooltip Updated",
        description: `Tooltip "${title}" has been updated.`
      });
    } else {
      onAddTooltip(tooltipData);
      toast({
        title: "Tooltip Added",
        description: `Tooltip "${title}" has been added.`
      });
    }

    setIsEditing(false);
    setCurrentTooltip(null);
    setTitle('');
    setContent('');
    setTags([]);
  };

  const handleRemoveTooltip = (tooltipId: string, tooltipTitle: string) => {
    onRemoveTooltip(tooltipId);
    toast({
      title: "Tooltip Removed",
      description: `Tooltip "${tooltipTitle}" has been removed.`
    });
  };

  const handleImportDialogOpen = () => {
    setIsImportDialogOpen(true);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const importedTooltips = parseCSVorExcel(csvData);
        
        if (importedTooltips.length === 0) {
          toast({
            title: "Import Failed",
            description: "No valid tooltips found in the file.",
            variant: "destructive"
          });
          return;
        }

        importedTooltips.forEach(tooltip => {
          onAddTooltip({
            id: `tooltip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: tooltip.title,
            content: tooltip.content,
            tags: tooltip.tags || []
          });
        });

        toast({
          title: "Import Successful",
          description: `${importedTooltips.length} tooltips imported.`
        });
        setIsImportDialogOpen(false);
      } catch (error) {
        console.error("Error parsing file:", error);
        toast({
          title: "Import Failed",
          description: "There was an error processing the file. Please check the format.",
          variant: "destructive"
        });
      }
    };

    reader.readAsText(file);
    // Reset file input so the same file can be selected again
    e.target.value = '';
  };

  const parseCSVorExcel = (data: string): { title: string; content: string; tags?: string[] }[] => {
    const result: { title: string; content: string; tags?: string[] }[] = [];
    
    // Split by newlines and filter out empty lines
    const lines = data.split(/\r?\n/).filter(line => line.trim().length > 0);
    
    if (lines.length === 0) return result;
    
    // Check if header includes tags
    const hasTagsColumn = lines[0].toLowerCase().includes('tags');
    
    // Skip header row if it exists
    const startIdx = lines[0].toLowerCase().includes('title') && 
                     lines[0].toLowerCase().includes('content') ? 1 : 0;
    
    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i];
      
      // Try to split by comma first (CSV format)
      let parts = line.split(',');
      
      // If we don't have at least 2 parts, try tab delimiter (Excel export format)
      if (parts.length < 2) {
        parts = line.split('\t');
      }
      
      if (parts.length >= 2) {
        const title = parts[0].trim();
        
        // If we have tags column, last column is tags, content is everything in between
        let content, tags;
        
        if (hasTagsColumn && parts.length >= 3) {
          // Content is everything except first and last column
          content = parts.slice(1, parts.length - 1).join(',').trim();
          // Last column is tags
          const tagsString = parts[parts.length - 1].trim();
          tags = tagsString ? tagsString.split(';').map(tag => tag.trim()) : [];
        } else {
          // No tags column, content is everything except first column
          content = parts.slice(1).join(',').trim();
        }
        
        if (title && content) {
          result.push({ title, content, tags });
        }
      }
    }
    
    return result;
  };

  const toggleSortDirection = () => {
    setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
    setShowTagSuggestions(false);
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Escape') {
      setShowTagSuggestions(false);
    }
  };

  const handleTagClick = (tag: string | null) => {
    setSelectedTag(tag);
    // If clicked the same tag again, clear the filter
    if (selectedTag === tag) {
      setSelectedTag(null);
    }
  };

  // Filter tooltips based on search query and selected tag
  const filteredTooltips = tooltips
    .filter(tooltip => 
      (searchQuery === '' || 
       tooltip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       tooltip.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
       tooltip.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      &&
      (selectedTag === null || tooltip.tags?.includes(selectedTag))
    )
    .sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });

  // Extract all unique tags across all tooltips
  const allTags = Array.from(
    new Set(
      tooltips.flatMap(tooltip => tooltip.tags || [])
    )
  ).sort();

  // Filter tag suggestions based on input
  const tagSuggestions = COMMON_TOOLTIP_TAGS.filter(tag => 
    tag.toLowerCase().includes(tagInput.toLowerCase()) && 
    !tags.includes(tag)
  );

  return (
    <div className="space-y-4">
      {/* Fixed header section that doesn't scroll */}
      <div className="sticky top-0 bg-white z-10 pb-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Tooltips</h3>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={handleImportDialogOpen}
                  >
                    <Upload size={16} className="inline-flex" />
                    <span>Import</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Import tooltips from CSV or Excel</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={handleAddNewTooltip}
            >
              <Plus size={16} className="inline-flex" />
              <span>Add Tooltip</span>
            </Button>
          </div>
        </div>

        <div className="flex gap-2 mb-2">
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Search tooltips..." 
            className="flex-1"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={toggleSortDirection}
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

        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {allTags.map(tag => (
              <Badge 
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleTagClick(tag)}
              >
                <Tag size={12} className="mr-1" /> {tag}
              </Badge>
            ))}
            {selectedTag && (
              <Button 
                variant="ghost" 
                size="xs" 
                onClick={() => setSelectedTag(null)}
                className="text-xs text-gray-500"
              >
                Clear filter
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Scrollable content area */}
      <ScrollArea className="h-[calc(100vh-240px)]">
        {filteredTooltips.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            {tooltips.length === 0 ? (
              <>
                <p>No tooltips created yet</p>
                <p className="text-sm mt-1">Create tooltips to provide additional information to users</p>
              </>
            ) : (
              <p>No tooltips match your search{selectedTag ? ` or tag filter: ${selectedTag}` : ''}</p>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4">Title</TableHead>
                <TableHead className="w-1/2">Content</TableHead>
                <TableHead className="w-1/5">Tags</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTooltips.map((tooltip) => (
                <TableRow key={tooltip.id} className="border-b">
                  <TableCell className="font-medium align-top">{tooltip.title}</TableCell>
                  <TableCell className="max-w-[250px] align-top">{tooltip.content}</TableCell>
                  <TableCell className="align-top">
                    <div className="flex flex-wrap gap-1">
                      {tooltip.tags?.map(tag => (
                        <HoverCard key={tag} openDelay={300} closeDelay={100}>
                          <HoverCardTrigger asChild>
                            <Badge 
                              variant="secondary" 
                              className="cursor-pointer"
                              onClick={() => handleTagClick(tag)}
                            >
                              <Tag size={10} className="mr-1" /> {tag.length > 10 ? `${tag.substring(0, 10)}...` : tag}
                            </Badge>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-auto p-2" align="start">
                            <span className="text-xs">{tag}</span>
                          </HoverCardContent>
                        </HoverCard>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right align-top">
                    <div className="flex justify-end">
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTooltip(tooltip)}
                          className="h-8 w-8 flex items-center justify-center"
                        >
                          <Edit size={16} className="text-blue-500" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveTooltip(tooltip.id, tooltip.title)}
                          className="h-8 w-8 flex items-center justify-center"
                        >
                          <Trash2 size={16} className="text-red-500" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </ScrollArea>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentTooltip ? 'Edit Tooltip' : 'Add New Tooltip'}
            </DialogTitle>
            <DialogDescription>
              Create tooltips to provide helpful information to users
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter tooltip title"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter tooltip content"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium flex items-center">
                Tags
                <span className="text-xs text-gray-500 ml-2">(Press Enter to add)</span>
              </label>
              <div className="relative">
                <div className="flex flex-wrap gap-1 mb-2">
                  {tags.map(tag => (
                    <Badge key={tag} className="flex items-center gap-1 bg-gray-100 text-gray-800">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <XCircle size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="relative">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => {
                      setTagInput(e.target.value);
                      setShowTagSuggestions(e.target.value.length > 0);
                    }}
                    onKeyDown={handleTagInputKeyPress}
                    onFocus={() => tagInput && setShowTagSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
                    placeholder="Add tags..."
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={addTag}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 px-2"
                    disabled={!tagInput.trim()}
                  >
                    Add
                  </Button>
                </div>
                
                {showTagSuggestions && tagSuggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-auto">
                    {tagSuggestions.map(suggestion => (
                      <div
                        key={suggestion}
                        className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => {
                          setTagInput(suggestion);
                          addTag();
                        }}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTooltip}>
              {currentTooltip ? 'Update' : 'Add'} Tooltip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Import Tooltips</DialogTitle>
            <DialogDescription>
              Import tooltips from CSV or Excel files with columns for Title, Content, and Tags (optional)
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <FileSpreadsheet size={48} className="text-gray-400" />
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">
                  Import tooltips from CSV or Excel files
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  File should have columns for Title, Content, and Tags (optional, separated by semicolons)
                </p>
              </div>
              <Button 
                onClick={handleFileSelect} 
                className="flex items-center gap-2"
              >
                <Upload size={16} />
                Select File
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv,.xls,.xlsx,.txt"
                style={{ display: 'none' }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TooltipManager;
