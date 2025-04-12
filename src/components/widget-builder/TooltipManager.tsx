
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { HelpCircle, Plus, Tag as TagIcon, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { COMMON_TOOLTIP_TAGS } from '@/types/widget-types';
import TagManager from './TagManager';
import SearchBar from './SearchBar';

export interface Tooltip {
  id: string;
  title: string;
  content: string;
  tags?: string[];
}

interface TooltipManagerProps {
  tooltips: Tooltip[];
  onAddTooltip: (tooltip: Tooltip) => void;
  onUpdateTooltip: (tooltipId: string, updatedTooltip: Tooltip) => void;
  onRemoveTooltip: (tooltipId: string) => void;
}

const TooltipManager: React.FC<TooltipManagerProps> = ({
  tooltips,
  onAddTooltip,
  onUpdateTooltip,
  onRemoveTooltip
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingTooltipId, setEditingTooltipId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>("tooltips");
  const [showTagSelector, setShowTagSelector] = useState(false);
  
  // Get all unique tags across all tooltips
  const allTags = Array.from(new Set(tooltips.flatMap(tooltip => tooltip.tags || []))).sort();

  const handleAddTooltip = () => {
    if (!title.trim() || !content.trim()) return;
    
    const newTooltip: Tooltip = {
      id: `tooltip-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      tags: selectedTags.length > 0 ? [...selectedTags] : undefined
    };
    
    onAddTooltip(newTooltip);
    setTitle('');
    setContent('');
    setSelectedTags([]);
  };

  const handleEditTooltip = (tooltipId: string) => {
    const tooltipToEdit = tooltips.find(t => t.id === tooltipId);
    if (!tooltipToEdit) return;
    
    setEditingTooltipId(tooltipId);
    setTitle(tooltipToEdit.title);
    setContent(tooltipToEdit.content);
    setSelectedTags(tooltipToEdit.tags || []);
  };

  const handleSaveEdit = () => {
    if (!editingTooltipId || !title.trim() || !content.trim()) return;
    
    const updatedTooltip: Tooltip = {
      id: editingTooltipId,
      title: title.trim(),
      content: content.trim(),
      tags: selectedTags.length > 0 ? [...selectedTags] : undefined
    };
    
    onUpdateTooltip(editingTooltipId, updatedTooltip);
    setEditingTooltipId(null);
    setTitle('');
    setContent('');
    setSelectedTags([]);
  };

  const handleCancelEdit = () => {
    setEditingTooltipId(null);
    setTitle('');
    setContent('');
    setSelectedTags([]);
  };

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleUpdateAllTags = (updatedTags: string[]) => {
    // Update all tooltips that have tags that are being removed
    const tagsToRemove = allTags.filter(tag => !updatedTags.includes(tag));
    
    if (tagsToRemove.length > 0) {
      tooltips.forEach(tooltip => {
        if (tooltip.tags) {
          const updatedTooltipTags = tooltip.tags.filter(tag => !tagsToRemove.includes(tag));
          
          if (updatedTooltipTags.length !== tooltip.tags.length) {
            onUpdateTooltip(tooltip.id, {
              ...tooltip,
              tags: updatedTooltipTags.length > 0 ? updatedTooltipTags : undefined
            });
          }
        }
      });
    }
    
    // If we're currently editing a tooltip, update the selected tags
    if (editingTooltipId) {
      setSelectedTags(prev => prev.filter(tag => updatedTags.includes(tag)));
    }
  };

  // Filter tooltips based on search query
  const filteredTooltips = tooltips.filter(tooltip => {
    const matchesTitle = tooltip.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesContent = tooltip.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = tooltip.tags?.some(tag => 
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return matchesTitle || matchesContent || matchesTags;
  });

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tooltips">Tooltips</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tooltips" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {editingTooltipId ? 'Edit Tooltip' : 'Create New Tooltip'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tooltip-title">Title</Label>
                <Input
                  id="tooltip-title"
                  placeholder="Tooltip title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tooltip-content">Content</Label>
                <Textarea
                  id="tooltip-content"
                  placeholder="Tooltip content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Tags</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowTagSelector(!showTagSelector)}
                  >
                    <TagIcon className="h-4 w-4 mr-1" />
                    {showTagSelector ? 'Hide Tags' : 'Show Tags'}
                  </Button>
                </div>
                
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedTags.map(tag => (
                      <Badge 
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleTagSelect(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
                
                {showTagSelector && (
                  <ScrollArea className="h-[120px] border rounded-md p-2">
                    <div className="flex flex-wrap gap-1">
                      {allTags.length === 0 ? (
                        <p className="text-sm text-muted-foreground p-2">
                          No tags available. Create tags in the Tags tab.
                        </p>
                      ) : (
                        allTags.map(tag => (
                          <Badge 
                            key={tag}
                            variant={selectedTags.includes(tag) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => handleTagSelect(tag)}
                          >
                            {tag}
                          </Badge>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {editingTooltipId ? (
                <>
                  <Button variant="ghost" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit} disabled={!title.trim() || !content.trim()}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={handleAddTooltip}
                  disabled={!title.trim() || !content.trim()}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Tooltip
                </Button>
              )}
            </CardFooter>
          </Card>

          <div className="mb-4">
            <SearchBar
              placeholder="Search tooltips..."
              onSearch={handleSearch}
              className="w-full"
            />
          </div>
          
          <div className="space-y-4">
            {filteredTooltips.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <HelpCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500">
                    {searchQuery ? "No tooltips match your search" : "No tooltips created yet"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredTooltips.map(tooltip => (
                <Card key={tooltip.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{tooltip.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{tooltip.content}</p>
                    
                    {tooltip.tags && tooltip.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tooltip.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveTooltip(tooltip.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTooltip(tooltip.id)}
                    >
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="tags" className="mt-4">
          <TagManager 
            tags={allTags} 
            onUpdateTags={handleUpdateAllTags} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TooltipManager;
