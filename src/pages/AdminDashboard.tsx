
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Clock, LayoutGrid, List, Eye, Filter, Search } from "lucide-react";
import ColorPalettePicker from "@/components/widget-builder/ColorPalettePicker";
import { PREDEFINED_COLORS } from "@/types/widget-types";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import type { WidgetSubmission, WidgetApprovalStatus } from "@/types/widget-types";

const AdminDashboard = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [themeColor, setThemeColor] = useState<string>("#6E59A5");
  const [widgets, setWidgets] = useState<WidgetSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  useEffect(() => {
    const loadWidgets = () => {
      try {
        const savedWidgets = localStorage.getItem('widgetSubmissions');
        if (savedWidgets) {
          const parsedWidgets = JSON.parse(savedWidgets);
          setWidgets(parsedWidgets);
        } else {
          setWidgets([]);
        }
      } catch (error) {
        console.error("Failed to load widgets", error);
        toast({
          title: "Error",
          description: "Failed to load widgets",
          variant: "destructive"
        });
      }
    };

    loadWidgets();
  }, [toast]);

  const getStatusBadge = (status: WidgetApprovalStatus) => {
    switch(status) {
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100">Draft</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          <Clock size={14} className="mr-1" /> Pending
        </Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">
          <Check size={14} className="mr-1" /> Approved
        </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">
          <X size={14} className="mr-1" /> Rejected
        </Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const approvedWidgets = widgets.filter(widget => widget.status === 'approved');
  const pendingWidgets = widgets.filter(widget => widget.status === 'pending');
  
  const renderWidgetCard = (widget: WidgetSubmission) => {
    return (
      <Card key={widget.id} className="overflow-hidden flex flex-col">
        <CardHeader className="pb-2 border-b">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{widget.name}</CardTitle>
            {getStatusBadge(widget.status)}
          </div>
        </CardHeader>
        
        <div className="p-4 flex justify-center items-center bg-gray-50">
          <div className="w-48 h-48 border rounded-md shadow-sm bg-white flex items-center justify-center overflow-hidden">
            {widget.thumbnail ? (
              <img 
                src={widget.thumbnail} 
                alt={`${widget.name} preview`} 
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center mx-auto mb-2">
                  <Eye className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">Widget Preview</p>
              </div>
            )}
          </div>
        </div>
        
        <CardContent className="py-3">
          <p className="text-sm text-gray-500 mb-2">
            Created: {new Date(widget.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm mb-2 line-clamp-2">{widget.description || "No description"}</p>
          {widget.tags && widget.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {widget.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-gray-50 pt-2 mt-auto">
          <div className="flex justify-between w-full">
            <Badge variant="outline">v{widget.version}</Badge>
            <div className="flex space-x-2">
              {widget.status === 'pending' && (
                <>
                  <Button variant="outline" size="sm" className="text-red-500 border-red-200">
                    <X size={14} className="mr-1" /> Reject
                  </Button>
                  <Button variant="outline" size="sm" className="text-green-500 border-green-200">
                    <Check size={14} className="mr-1" /> Approve
                  </Button>
                </>
              )}
              <Link to={`/?widgetId=${widget.id}`}>
                <Button variant="default" size="sm">
                  <Eye size={14} className="mr-1" /> View
                </Button>
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage widgets and approvals</p>
      </header>
      
      <Tabs defaultValue="published" className="mb-8">
        <TabsList>
          <TabsTrigger value="published">Published Widgets</TabsTrigger>
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          <TabsTrigger value="settings">Theme Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="published">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Published Widgets</h2>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search widgets..." 
                      className="pl-8 w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                  </div>
                </div>
                
                <ToggleGroup 
                  type="single" 
                  value={viewMode} 
                  onValueChange={(value) => value && setViewMode(value as 'list' | 'grid')}
                >
                  <ToggleGroupItem value="list" aria-label="List view">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="grid" aria-label="Grid view">
                    <LayoutGrid className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
            
            {approvedWidgets.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500 mb-4">No published widgets found</p>
                <Button>Create a Widget</Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedWidgets
                  .filter(widget => 
                    searchQuery === "" || 
                    widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (widget.description && widget.description.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map(renderWidgetCard)}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="pending">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Pending Approvals</h2>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex gap-1 items-center">
                  <Clock size={14} />
                  {pendingWidgets.length} Widgets Awaiting Review
                </Badge>
              </div>
            </div>
            
            {pendingWidgets.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">No widgets awaiting approval</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingWidgets.map(renderWidgetCard)}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>Customize the widget appearance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ColorPalettePicker
                  label="Primary Color"
                  value={themeColor}
                  onChange={setThemeColor}
                  colors={PREDEFINED_COLORS}
                />
                
                <div>
                  <Label htmlFor="widget-scale">Widget Scale</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Input id="widget-scale" type="range" min="50" max="150" defaultValue="100" />
                    <span className="text-sm font-medium">100%</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
