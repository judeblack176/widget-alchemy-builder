
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash, Edit, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tag } from '@/types/widget-types';
import { useToast } from '@/components/ui/use-toast';

const TagsManager = () => {
  const { toast } = useToast();
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editedTagName, setEditedTagName] = useState('');

  useEffect(() => {
    try {
      const savedTags = localStorage.getItem('widgetTags');
      if (savedTags) {
        setTags(JSON.parse(savedTags));
      }
    } catch (error) {
      console.error('Failed to load tags', error);
    }
  }, []);

  const saveTagsToLocalStorage = (updatedTags: Tag[]) => {
    try {
      localStorage.setItem('widgetTags', JSON.stringify(updatedTags));
    } catch (error) {
      console.error('Failed to save tags', error);
    }
  };

  const handleAddTag = () => {
    if (!newTagName.trim()) {
      toast({
        title: "Error",
        description: "Tag name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const existingTag = tags.find(tag => tag.name.toLowerCase() === newTagName.toLowerCase());
    if (existingTag) {
      toast({
        title: "Error",
        description: "A tag with this name already exists",
        variant: "destructive"
      });
      return;
    }

    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name: newTagName.trim(),
      color: getRandomTagColor()
    };

    const updatedTags = [...tags, newTag];
    setTags(updatedTags);
    saveTagsToLocalStorage(updatedTags);
    setNewTagName('');
    
    toast({
      title: "Tag Added",
      description: `Added tag: ${newTag.name}`
    });
  };

  const handleEditTag = (tagId: string) => {
    const tagToEdit = tags.find(tag => tag.id === tagId);
    if (tagToEdit) {
      setEditingTagId(tagId);
      setEditedTagName(tagToEdit.name);
    }
  };

  const handleSaveEdit = (tagId: string) => {
    if (!editedTagName.trim()) {
      toast({
        title: "Error",
        description: "Tag name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const existingTag = tags.find(
      tag => tag.name.toLowerCase() === editedTagName.toLowerCase() && tag.id !== tagId
    );
    
    if (existingTag) {
      toast({
        title: "Error",
        description: "A tag with this name already exists",
        variant: "destructive"
      });
      return;
    }

    const updatedTags = tags.map(tag => 
      tag.id === tagId ? { ...tag, name: editedTagName.trim() } : tag
    );
    
    setTags(updatedTags);
    saveTagsToLocalStorage(updatedTags);
    setEditingTagId(null);
    
    toast({
      title: "Tag Updated",
      description: `Updated tag to: ${editedTagName}`
    });
  };

  const handleDeleteTag = (tagId: string) => {
    const updatedTags = tags.filter(tag => tag.id !== tagId);
    setTags(updatedTags);
    saveTagsToLocalStorage(updatedTags);
    
    toast({
      title: "Tag Deleted",
      description: "The tag has been removed"
    });
  };

  const getRandomTagColor = () => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-red-100 text-red-800',
      'bg-gray-100 text-gray-800'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="space-y-4">
      <Card className="border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Add New Tag</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Enter tag name"
              className="flex-1"
            />
            <Button onClick={handleAddTag} size="sm">
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <h3 className="font-medium text-gray-700 mb-3">Your Tags</h3>
        {tags.length === 0 ? (
          <Card className="border border-dashed p-6">
            <p className="text-center text-gray-500">No tags created yet</p>
            <p className="text-center text-sm text-gray-400 mt-1">
              Create tags to organize your widgets and tooltips
            </p>
          </Card>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {tags.map(tag => (
                <Card key={tag.id} className="p-3 mb-2">
                  <div className="flex items-center justify-between">
                    {editingTagId === tag.id ? (
                      <div className="flex-1 flex items-center space-x-2">
                        <Input
                          value={editedTagName}
                          onChange={(e) => setEditedTagName(e.target.value)}
                          className="flex-1"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSaveEdit(tag.id)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center">
                        <Badge 
                          variant="outline" 
                          className={`mr-2 ${tag.color}`}
                        >
                          {tag.name}
                        </Badge>
                      </div>
                    )}
                    
                    {editingTagId !== tag.id && (
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditTag(tag.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTag(tag.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default TagsManager;
