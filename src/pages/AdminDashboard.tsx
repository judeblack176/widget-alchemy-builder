
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Clock, LayoutGrid, List, Filter, Search, Link as LinkIcon, Database, ExternalLink, Shield, ShieldCheck, ShieldX } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { WidgetSubmission, WidgetApprovalStatus, ApiConfig } from "@/types/widget-types";
import WidgetPreview from "@/components/widget-builder/WidgetPreview";

const AdminDashboard = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'card'>('card');
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
  
  // Helper function to verify if an API or link is verified
  const getVerificationStatus = (item: string) => {
    // This is a mock implementation - in a real app, you would check against a whitelist or database
    const mockVerifiedDomains = [
      'api.example.com', 
      'data.mycompany.com', 
      'api.trusted-source.org',
      'example.com',
      'mycompany.com',
      'trusted-source.org'
    ];
    
    // Check if the URL is in our verified list
    const isVerified = mockVerifiedDomains.some(domain => item.includes(domain));
    
    return isVerified;
  };
  
  const renderVerificationBadge = (item: string, type: 'api' | 'link') => {
    const isVerified = getVerificationStatus(item);
    
    if (isVerified) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
                <ShieldCheck size={12} />
                Verified
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>This {type} is from a verified source</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 flex items-center gap-1">
                <Shield size={12} />
                Unverified
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>This {type} is from an unverified source</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
  };
  
  const approvedWidgets = widgets.filter(widget => widget.status === 'approved');
  const pendingWidgets = widgets.filter(widget => widget.status === 'pending');
  
  const renderWidgetCard = (widget: WidgetSubmission) => {
    // Extract APIs and links from the widget for demonstration
    const apis = widget.config.components
      ?.filter(comp => comp.apiConfig?.apiId)
      .map(comp => comp.apiConfig?.apiId ? 
        widget.config.apis.find(api => api.id === comp.apiConfig?.apiId) : null)
      .filter(api => api) as ApiConfig[];
    
    const links = widget.config.components
      ?.filter(comp => comp.type === 'link')
      .map(comp => comp.props.url)
      .filter(url => url) as string[];
    
    return (
      <Card key={widget.id} className="overflow-hidden flex flex-col">
        <CardHeader className="pb-2 border-b">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{widget.name}</CardTitle>
            {getStatusBadge(widget.status)}
          </div>
        </CardHeader>
        
        <div className="p-4 flex justify-center items-center bg-gray-50">
          {widget.config.components && widget.config.apis && (
            <WidgetPreview components={widget.config.components} apis={widget.config.apis} />
          )}
        </div>
        
        <CardContent className="py-3">
          <p className="text-sm text-gray-500 mb-2">
            Created: {new Date(widget.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm mb-2 line-clamp-2">{widget.description || "No description"}</p>
          
          {/* Display APIs used in the widget */}
          {apis && apis.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-500 mb-1">APIs:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {apis.map((api, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <Database size={10} />
                      {api.name}
                    </Badge>
                    {renderVerificationBadge(api.endpoint, 'api')}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Display links used in the widget */}
          {links && links.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-500 mb-1">Links:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {links.map((link, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <ExternalLink size={10} />
                      {link.substring(0, 15)}{link.length > 15 ? '...' : ''}
                    </Badge>
                    {renderVerificationBadge(link, 'link')}
                  </div>
                ))}
              </div>
            </div>
          )}
          
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
            </div>
          </div>
        </CardFooter>
      </Card>
    );
  };

  const renderWidgetTable = (widgetList: WidgetSubmission[]) => {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>APIs</TableHead>
              <TableHead>External Links</TableHead>
              <TableHead>Version</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {widgetList
              .filter(widget => 
                searchQuery === "" || 
                widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (widget.description && widget.description.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map((widget) => {
                // Extract APIs and links for this widget
                const apis = widget.config.components
                  ?.filter(comp => comp.apiConfig?.apiId)
                  .map(comp => comp.apiConfig?.apiId ? 
                    widget.config.apis.find(api => api.id === comp.apiConfig?.apiId) : null)
                  .filter(api => api) as ApiConfig[];
                
                const links = widget.config.components
                  ?.filter(comp => comp.type === 'link')
                  .map(comp => comp.props.url)
                  .filter(url => url) as string[];
                
                return (
                  <TableRow key={widget.id}>
                    <TableCell className="font-medium">{widget.name}</TableCell>
                    <TableCell>{new Date(widget.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(widget.status)}</TableCell>
                    <TableCell>
                      {apis && apis.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {apis.map((api, index) => (
                            <div key={index} className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                {api.name}
                              </Badge>
                              {renderVerificationBadge(api.endpoint, 'api')}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {links && links.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {links.map((link, index) => (
                            <div key={index} className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                {link.substring(0, 15)}{link.length > 15 ? '...' : ''}
                              </Badge>
                              {renderVerificationBadge(link, 'link')}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell>{widget.version}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
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
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
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
                  onValueChange={(value) => value && setViewMode(value as 'list' | 'grid' | 'card')}
                >
                  <ToggleGroupItem value="list" aria-label="List view">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="grid" aria-label="Grid view">
                    <LayoutGrid className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="card" aria-label="Card view">
                    <Card className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
            
            {approvedWidgets.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500 mb-4">No published widgets found</p>
                <Button>Create a Widget</Button>
              </Card>
            ) : viewMode === 'list' ? (
              renderWidgetTable(approvedWidgets)
            ) : viewMode === 'card' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedWidgets
                  .filter(widget => 
                    searchQuery === "" || 
                    widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (widget.description && widget.description.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map(renderWidgetCard)}
              </div>
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
              
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="flex gap-1 items-center">
                  <Clock size={14} />
                  {pendingWidgets.length} Widgets Awaiting Review
                </Badge>
                
                <ToggleGroup 
                  type="single" 
                  value={viewMode} 
                  onValueChange={(value) => value && setViewMode(value as 'list' | 'grid' | 'card')}
                >
                  <ToggleGroupItem value="list" aria-label="List view">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="grid" aria-label="Grid view">
                    <LayoutGrid className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="card" aria-label="Card view">
                    <Card className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
            
            {pendingWidgets.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">No widgets awaiting approval</p>
              </Card>
            ) : viewMode === 'list' ? (
              renderWidgetTable(pendingWidgets)
            ) : viewMode === 'card' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingWidgets.map(renderWidgetCard)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingWidgets.map(renderWidgetCard)}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
