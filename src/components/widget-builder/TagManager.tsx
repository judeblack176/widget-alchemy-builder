
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, X, Tag as TagIcon, Trash, Edit, Save, Upload, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { COMMON_TOOLTIP_TAGS } from '@/types/widget-types';

interface TagManagerProps {
  tags: string[];
  onUpdateTags: (tags: string[]) => void;
}

const TagManager: React.FC<TagManagerProps> = ({ tags, onUpdateTags }) => {
  const [newTag, setNewTag] = useState('');
  const [editingTag, setEditingTag] = useState<{ originalTag: string; newTag: string } | null>(null);
  const [showCommonTags, setShowCommonTags] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (!trimmedTag) return;
    
    if (tags.includes(trimmedTag)) {
      setErrorMessage(`Tag "${trimmedTag}" already exists`);
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    onUpdateTags([...tags, trimmedTag]);
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleEditTag = (originalTag: string) => {
    setEditingTag({ originalTag, newTag: originalTag });
  };

  const handleSaveEdit = () => {
    if (!editingTag) return;
    
    const trimmedTag = editingTag.newTag.trim();
    if (!trimmedTag) {
      setErrorMessage("Tag cannot be empty");
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    if (trimmedTag !== editingTag.originalTag && tags.includes(trimmedTag)) {
      setErrorMessage(`Tag "${trimmedTag}" already exists`);
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    onUpdateTags(tags.map(tag => tag === editingTag.originalTag ? trimmedTag : tag));
    setEditingTag(null);
  };

  const handleAddCommonTag = (tag: string) => {
    if (tags.includes(tag)) {
      setErrorMessage(`Tag "${tag}" already exists`);
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    onUpdateTags([...tags, tag]);
  };

  const handleExportTags = () => {
    const dataStr = JSON.stringify(tags);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `tooltip-tags-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportTags = () => {
    try {
      const importedTags = JSON.parse(importText);
      
      if (!Array.isArray(importedTags)) {
        throw new Error('Imported data is not an array');
      }
      
      const validTags = importedTags
        .filter(tag => typeof tag === 'string' && tag.trim() !== '')
        .map(tag => tag.trim());
      
      // Filter out duplicates and merge with existing tags
      const uniqueTags = [...new Set([...tags, ...validTags])];
      
      onUpdateTags(uniqueTags);
      setImportDialogOpen(false);
      setImportText('');
    } catch (error) {
      setErrorMessage('Invalid JSON format. Please check your data.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TagIcon className="mr-2 h-5 w-5" />
          Tag Management
        </CardTitle>
        <CardDescription>
          Create and manage tags to organize your tooltips
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {errorMessage && (
          <Alert variant="destructive" className="mb-2">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              placeholder="Add new tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
            />
          </div>
          <Button onClick={handleAddTag} size="sm">
            <PlusCircle className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <h3 className="text-sm font-medium">Current Tags ({tags.length})</h3>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setShowCommonTags(!showCommonTags)}>
                    <TagIcon className="h-4 w-4 mr-1" /> 
                    {showCommonTags ? 'Hide' : 'Show'} Common Tags
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show predefined common tags</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setImportDialogOpen(true)}>
                    <Upload className="h-4 w-4 mr-1" /> Import
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Import tags from JSON</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleExportTags}
                    disabled={tags.length === 0}
                  >
                    <Download className="h-4 w-4 mr-1" /> Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export tags to JSON file</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {tags.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No tags created yet. Add your first tag above.
          </div>
        ) : (
          <ScrollArea className="h-[200px] mt-2">
            <div className="flex flex-wrap gap-2 pb-4">
              {tags.map(tag => (
                <div key={tag} className="flex items-center">
                  {editingTag?.originalTag === tag ? (
                    <div className="flex mr-1">
                      <Input
                        className="h-7 py-1 px-2 text-xs w-32"
                        value={editingTag.newTag}
                        onChange={(e) => setEditingTag({ ...editingTag, newTag: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                        autoFocus
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7" 
                        onClick={handleSaveEdit}
                      >
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7" 
                        onClick={() => setEditingTag(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <Badge 
                      variant="secondary"
                      className="flex items-center gap-1 pr-1 bg-gray-100 hover:bg-gray-200"
                    >
                      <span>{tag}</span>
                      <div className="flex">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-4 w-4 p-0 hover:bg-transparent" 
                          onClick={() => handleEditTag(tag)}
                        >
                          <Edit className="h-3 w-3 text-gray-500 hover:text-gray-700" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-4 w-4 p-0 hover:bg-transparent" 
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <Trash className="h-3 w-3 text-gray-500 hover:text-red-500" />
                        </Button>
                      </div>
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        {showCommonTags && (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Common Tags</h3>
            <ScrollArea className="h-[120px]">
              <div className="flex flex-wrap gap-2 pb-4">
                {COMMON_TOOLTIP_TAGS.map(tag => (
                  <Badge 
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleAddCommonTag(tag)}
                  >
                    {tag}
                    <PlusCircle className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
      
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Import Tags</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              Paste JSON array of tags below:
            </p>
            <Input
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='["Tag1", "Tag2", "Tag3"]'
              className="font-mono"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImportTags}>
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TagManager;
