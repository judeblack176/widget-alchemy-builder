
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Home, 
  Tag as TagIcon, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchBar from "@/components/widget-builder/SearchBar";
import { COMMON_TOOLTIP_TAGS } from "@/types/widget-types";

const TagsPage = () => {
  const { toast } = useToast();
  const [tags, setTags] = useState<string[]>([]);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [editingTag, setEditingTag] = useState("");
  const [editedTagName, setEditedTagName] = useState("");
  const [deletingTag, setDeletingTag] = useState("");

  // Load tags from local storage on component mount
  useEffect(() => {
    try {
      const savedTags = localStorage.getItem('savedTags');
      if (savedTags) {
        setTags(JSON.parse(savedTags));
        setFilteredTags(JSON.parse(savedTags));
      } else {
        // Initialize with common tags if no saved tags exist
        setTags([...COMMON_TOOLTIP_TAGS]);
        setFilteredTags([...COMMON_TOOLTIP_TAGS]);
        localStorage.setItem('savedTags', JSON.stringify(COMMON_TOOLTIP_TAGS));
      }
    } catch (error) {
      console.error("Failed to load tags", error);
      setTags([...COMMON_TOOLTIP_TAGS]);
      setFilteredTags([...COMMON_TOOLTIP_TAGS]);
    }
  }, []);

  // Filter tags based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredTags(tags);
    } else {
      const filtered = tags.filter(tag => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTags(filtered);
    }
  }, [searchQuery, tags]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreateTag = () => {
    if (!newTagName.trim()) {
      toast({
        title: "Error",
        description: "Tag name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    if (tags.includes(newTagName.trim())) {
      toast({
        title: "Error",
        description: "Tag already exists",
        variant: "destructive"
      });
      return;
    }

    const updatedTags = [...tags, newTagName.trim()];
    setTags(updatedTags);
    localStorage.setItem('savedTags', JSON.stringify(updatedTags));
    
    setNewTagName("");
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Tag Created",
      description: `Tag "${newTagName.trim()}" has been created.`
    });
  };

  const handleEditTag = () => {
    if (!editedTagName.trim()) {
      toast({
        title: "Error",
        description: "Tag name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    if (tags.includes(editedTagName.trim()) && editedTagName.trim() !== editingTag) {
      toast({
        title: "Error",
        description: "Tag already exists",
        variant: "destructive"
      });
      return;
    }

    const updatedTags = tags.map(tag => tag === editingTag ? editedTagName.trim() : tag);
    setTags(updatedTags);
    localStorage.setItem('savedTags', JSON.stringify(updatedTags));
    
    setEditingTag("");
    setEditedTagName("");
    setIsEditDialogOpen(false);
    
    toast({
      title: "Tag Updated",
      description: `Tag has been updated to "${editedTagName.trim()}".`
    });
  };

  const handleDeleteTag = () => {
    const updatedTags = tags.filter(tag => tag !== deletingTag);
    setTags(updatedTags);
    localStorage.setItem('savedTags', JSON.stringify(updatedTags));
    
    setDeletingTag("");
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Tag Deleted",
      description: `Tag "${deletingTag}" has been deleted.`
    });
  };

  const openEditDialog = (tag: string) => {
    setEditingTag(tag);
    setEditedTagName(tag);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (tag: string) => {
    setDeletingTag(tag);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 p-4 w-full sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/">
              <Button variant="outline" size="icon" className="mr-2">
                <ArrowLeft size={16} />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold flex items-center">
              <TagIcon size={24} className="mr-2 text-widget-blue" />
              Tag Management
            </h1>
          </div>
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Home size={16} />
              Widget Builder
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Manage Tags</CardTitle>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-widget-blue hover:bg-blue-600">
                <Plus size={16} className="mr-2" />
                New Tag
              </Button>
            </div>
            <CardDescription>
              Create, edit, and delete tags for organizing your tooltips and components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <div className="w-full max-w-md">
                <SearchBar 
                  onSearch={handleSearch} 
                  placeholder="Search tags..." 
                  showIcon={true}
                />
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-300px)] pr-4">
              {filteredTags.length === 0 ? (
                <div className="py-8 text-center">
                  <TagIcon className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-500">No tags found</p>
                  {searchQuery && (
                    <p className="text-sm text-gray-400 mt-1">
                      Try a different search term or create a new tag
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTags.map((tag, index) => (
                    <Card key={index} className="border border-gray-200 hover:border-widget-blue transition-colors">
                      <CardContent className="p-4 flex justify-between items-center">
                        <Badge variant="outline" className="text-md font-normal py-1.5 px-3">
                          {tag}
                        </Badge>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => openEditDialog(tag)}
                            title="Edit tag"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="text-red-500 hover:text-red-600"
                            onClick={() => openDeleteDialog(tag)}
                            title="Delete tag"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </main>

      {/* Create Tag Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
            <DialogDescription>
              Enter a name for your new tag. Tags help organize tooltips and components.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Tag name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTag} className="bg-widget-blue hover:bg-blue-600">
              Create Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>
              Update the name of this tag.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Tag name"
              value={editedTagName}
              onChange={(e) => setEditedTagName(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTag} className="bg-widget-blue hover:bg-blue-600">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Tag Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tag</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this tag? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center">
            <Badge className="text-md py-1.5 px-3">
              {deletingTag}
            </Badge>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTag}
            >
              Delete Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TagsPage;
