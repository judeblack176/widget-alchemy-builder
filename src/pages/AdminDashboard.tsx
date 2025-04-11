import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Clock, LayoutGrid, List, Filter, Search, Link as LinkIcon, Database, ExternalLink, Shield, ShieldCheck, ShieldX, BarChart3, LineChart as LucideLineChart, PieChart as LucidePieChart, Users, AlertTriangle, Activity, TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { WidgetSubmission, WidgetApprovalStatus, ApiConfig } from "@/types/widget-types";
import WidgetPreview from "@/components/widget-builder/WidgetPreview";
import AdminLayout from "@/components/layouts/AdminLayout";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

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

  const widgetActivityData = [
    { name: 'Jan', submissions: 4, approvals: 3, rejections: 1 },
    { name: 'Feb', submissions: 7, approvals: 5, rejections: 2 },
    { name: 'Mar', submissions: 10, approvals: 7, rejections: 3 },
    { name: 'Apr', submissions: 15, approvals: 12, rejections: 3 },
    { name: 'May', submissions: 12, approvals: 10, rejections: 2 },
    { name: 'Jun', submissions: 18, approvals: 15, rejections: 3 },
  ];

  const widgetCategoryData = [
    { name: 'Data Visualization', value: 35 },
    { name: 'Interactive Tools', value: 25 },
    { name: 'Learning Materials', value: 20 },
    { name: 'Assessment', value: 15 },
    { name: 'Other', value: 5 },
  ];

  const pieColors = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#E5DEFF'];
  
  const apiSafetyData = [
    { name: 'Verified APIs', value: 65 },
    { name: 'Unverified APIs', value: 35 },
  ];
  
  const safetyColors = ['#33C3F0', '#FEC6A1'];

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
  
  const getVerificationStatus = (item: string) => {
    const mockVerifiedDomains = [
      'api.example.com', 
      'data.mycompany.com', 
      'api.trusted-source.org',
      'example.com',
      'mycompany.com',
      'trusted-source.org'
    ];
    
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
  const draftWidgets = widgets.filter(widget => widget.status === 'draft');
  const rejectedWidgets = widgets.filter(widget => widget.status === 'rejected');
  
  const renderWidgetCard = (widget: WidgetSubmission) => {
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
  
  const renderOverviewTab = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg font-medium">
                <Activity className="h-4 w-4 mr-2 text-primary" />
                Total Widgets
              </CardTitle>
              <CardDescription>All widgets in the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{widgets.length}</div>
                <div className="flex flex-col text-right">
                  <span className="text-sm text-muted-foreground">
                    {approvedWidgets.length} Published
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {pendingWidgets.length} Pending
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg font-medium">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Approved Widgets
              </CardTitle>
              <CardDescription>Breakdown of published widgets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-green-500">{approvedWidgets.length}</div>
                <div className="flex flex-col text-right">
                  <span className="text-sm text-muted-foreground">
                    {Math.round((approvedWidgets.length / (widgets.length || 1)) * 100)}% of Total
                  </span>
                  <span className="text-sm text-green-500 font-medium">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    Active
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg font-medium">
                <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                Pending Approval
              </CardTitle>
              <CardDescription>Widgets awaiting review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-yellow-500">{pendingWidgets.length}</div>
                <div className="flex flex-col text-right">
                  <span className="text-sm text-muted-foreground">
                    {Math.round((pendingWidgets.length / (widgets.length || 1)) * 100)}% of Total
                  </span>
                  {pendingWidgets.length > 0 && (
                    <span className="text-sm text-yellow-500 font-medium">
                      Needs Attention
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg font-medium">
                <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                Widget Status Overview
              </CardTitle>
              <CardDescription>Breakdown by approval status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">Draft</span>
                    <Badge variant="outline" className="bg-gray-100">
                      {draftWidgets.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">Pending</span>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      {pendingWidgets.length}
                    </Badge>
                  </div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">Approved</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      {approvedWidgets.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">Rejected</span>
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      {rejectedWidgets.length}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg font-medium">
                <Users className="h-4 w-4 mr-2 text-primary" />
                API Usage
              </CardTitle>
              <CardDescription>Number of API connections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">
                  {widgets.reduce((acc, widget) => {
                    const apis = widget.config.components
                      ?.filter(comp => comp.apiConfig?.apiId)
                      .map(comp => comp.apiConfig?.apiId)
                      .filter(api => api);
                    return acc + (apis?.length || 0);
                  }, 0)}
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-sm text-muted-foreground">
                    Across {widgets.length} Widgets
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-medium">
                <LucideLineChart className="h-4 w-4 mr-2 text-primary" />
                Widget Activity
              </CardTitle>
              <CardDescription>
                Submissions, approvals, and rejections over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ChartContainer
                  config={{
                    submissions: { label: "Submissions", color: "#9b87f5" },
                    approvals: { label: "Approvals", color: "#33C3F0" },
                    rejections: { label: "Rejections", color: "#ea384c" },
                  }}
                >
                  <AreaChart
                    data={widgetActivityData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorApprovals" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#33C3F0" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#33C3F0" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorRejections" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ea384c" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ea384c" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="submissions" stroke="#9b87f5" fillOpacity={1} fill="url(#colorSubmissions)" />
                    <Area type="monotone" dataKey="approvals" stroke="#33C3F0" fillOpacity={1} fill="url(#colorApprovals)" />
                    <Area type="monotone" dataKey="rejections" stroke="#ea384c" fillOpacity={1} fill="url(#colorRejections)" />
                  </AreaChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-medium">
                <LucidePieChart className="h-4 w-4 mr-2 text-primary" />
                Widget Categories
              </CardTitle>
              <CardDescription>
                Distribution by widget type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ChartContainer
                  config={{
                    dataVisualization: { label: "Data Visualization", color: "#9b87f5" },
                    interactiveTools: { label: "Interactive Tools", color: "#7E69AB" },
                    learningMaterials: { label: "Learning Materials", color: "#6E59A5" },
                    assessment: { label: "Assessment", color: "#D6BCFA" },
                    other: { label: "Other", color: "#E5DEFF" },
                  }}
                >
                  <RechartsPieChart>
                    <Pie
                      data={widgetCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {widgetCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </RechartsPieChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-medium">
                <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                Monthly Submissions
              </CardTitle>
              <CardDescription>
                Widget submissions over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ChartContainer
                  config={{
                    submissions: { label: "Submissions", color: "#9b87f5" },
                  }}
                >
                  <BarChart
                    data={widgetActivityData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="submissions" fill="#9b87f5" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-medium">
                <ShieldCheck className="h-4 w-4 mr-2 text-primary" />
                API Safety Overview
              </CardTitle>
              <CardDescription>
                Verified vs unverified API connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ChartContainer
                  config={{
                    verified: { label: "Verified APIs", color: "#33C3F0" },
                    unverified: { label: "Unverified APIs", color: "#FEC6A1" },
                  }}
                >
                  <RechartsPieChart>
                    <Pie
                      data={apiSafetyData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {apiSafetyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={safetyColors[index % safetyColors.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </RechartsPieChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  return (
    <AdminLayout title="Widget Management">
      <div className="container mx-auto">
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="published">Published Widgets</TabsTrigger>
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            {renderOverviewTab()}
          </TabsContent>
          
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
    </AdminLayout>
  );
};

export default AdminDashboard;
