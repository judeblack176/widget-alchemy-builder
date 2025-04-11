
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock, Check, X, Filter, Search, Eye } from "lucide-react";
import type { WidgetSubmission, WidgetApprovalStatus } from "@/types/widget-types";
import { WidgetApprovalDetails } from "@/components/widget-approval/WidgetApprovalDetails";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [widgets, setWidgets] = useState<WidgetSubmission[]>([]);
  const [filteredWidgets, setFilteredWidgets] = useState<WidgetSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [selectedWidget, setSelectedWidget] = useState<WidgetSubmission | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    // Load widgets from localStorage for now
    // In a real app, this would be an API call with admin authentication
    const loadWidgets = () => {
      setLoading(true);
      try {
        const savedWidgets = localStorage.getItem('widgetSubmissions');
        if (savedWidgets) {
          setWidgets(JSON.parse(savedWidgets));
        } else {
          setWidgets([]);
        }
      } catch (error) {
        console.error("Failed to load widgets", error);
        toast({
          title: "Error",
          description: "Failed to load widget submissions",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadWidgets();
  }, [toast]);

  useEffect(() => {
    // Filter widgets based on search query and status filter
    let filtered = [...widgets];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        widget => 
          widget.name.toLowerCase().includes(query) ||
          widget.description.toLowerCase().includes(query) ||
          (widget.tags && widget.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(widget => widget.status === statusFilter);
    }
    
    setFilteredWidgets(filtered);
  }, [widgets, searchQuery, statusFilter]);

  const handleOpenDetails = (widget: WidgetSubmission) => {
    setSelectedWidget(widget);
    setIsDetailsOpen(true);
  };

  const handleApproveWidget = (widgetId: string) => {
    const updatedWidgets = widgets.map(widget => {
      if (widget.id === widgetId) {
        return {
          ...widget,
          status: 'approved' as WidgetApprovalStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return widget;
    });
    
    setWidgets(updatedWidgets);
    localStorage.setItem('widgetSubmissions', JSON.stringify(updatedWidgets));
    
    toast({
      title: "Widget Approved",
      description: "The widget has been approved and is now available in the library"
    });
    
    setIsDetailsOpen(false);
  };

  const handleRejectWidget = (widgetId: string, feedback: string) => {
    const updatedWidgets = widgets.map(widget => {
      if (widget.id === widgetId) {
        return {
          ...widget,
          status: 'rejected' as WidgetApprovalStatus,
          feedback,
          updatedAt: new Date().toISOString()
        };
      }
      return widget;
    });
    
    setWidgets(updatedWidgets);
    localStorage.setItem('widgetSubmissions', JSON.stringify(updatedWidgets));
    
    toast({
      title: "Widget Rejected",
      description: "The widget has been rejected with feedback"
    });
    
    setIsDetailsOpen(false);
  };
  
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

  const totalByStatus = {
    pending: widgets.filter(w => w.status === 'pending').length,
    approved: widgets.filter(w => w.status === 'approved').length,
    rejected: widgets.filter(w => w.status === 'rejected').length,
    all: widgets.length
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mr-2">
                <ArrowLeft size={16} className="mr-1" /> Back to Builder
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-widget-blue">Admin Dashboard</h1>
          </div>
          <div>
            <Link to="/library">
              <Button variant="outline" className="mr-2">Widget Library</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-6 flex-1 overflow-auto">
        <Tabs defaultValue="review" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <TabsList>
              <TabsTrigger value="review" className="relative">
                Review Queue 
                {totalByStatus.pending > 0 && (
                  <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {totalByStatus.pending}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="all">All Submissions</TabsTrigger>
              <TabsTrigger value="approved">
                Approved
                {totalByStatus.approved > 0 && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {totalByStatus.approved}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected
                {totalByStatus.rejected > 0 && (
                  <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {totalByStatus.rejected}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search widgets..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full md:w-40">
                  <div className="flex items-center">
                    <Filter size={14} className="mr-2" />
                    <SelectValue placeholder="Filter" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="review" className="space-y-4">
            <Card className="p-4">
              <div className="text-lg font-medium mb-2">Widgets Pending Review</div>
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="h-6 w-6 border-t-2 border-b-2 border-widget-blue rounded-full animate-spin"></div>
                </div>
              ) : filteredWidgets.filter(w => w.status === 'pending').length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg border">
                  <div className="mb-4 text-gray-400">No widgets pending review</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredWidgets
                        .filter(widget => widget.status === 'pending')
                        .map((widget) => (
                          <TableRow key={widget.id}>
                            <TableCell className="font-medium">{widget.name}</TableCell>
                            <TableCell>{widget.author}</TableCell>
                            <TableCell>{new Date(widget.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{widget.category}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleOpenDetails(widget)}>
                                <Eye size={16} className="mr-1" /> Review
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <Card className="p-4">
              <div className="text-lg font-medium mb-2">All Widget Submissions</div>
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="h-6 w-6 border-t-2 border-b-2 border-widget-blue rounded-full animate-spin"></div>
                </div>
              ) : filteredWidgets.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg border">
                  <div className="mb-4 text-gray-400">No widgets found</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredWidgets.map((widget) => (
                        <TableRow key={widget.id}>
                          <TableCell className="font-medium">{widget.name}</TableCell>
                          <TableCell>{widget.author}</TableCell>
                          <TableCell>{getStatusBadge(widget.status)}</TableCell>
                          <TableCell>{new Date(widget.updatedAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleOpenDetails(widget)}>
                              <Eye size={16} className="mr-1" /> View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <Card className="p-4">
              <div className="text-lg font-medium mb-2">Approved Widgets</div>
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="h-6 w-6 border-t-2 border-b-2 border-widget-blue rounded-full animate-spin"></div>
                </div>
              ) : filteredWidgets.filter(w => w.status === 'approved').length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg border">
                  <div className="mb-4 text-gray-400">No approved widgets</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Approved Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredWidgets
                        .filter(widget => widget.status === 'approved')
                        .map((widget) => (
                          <TableRow key={widget.id}>
                            <TableCell className="font-medium">{widget.name}</TableCell>
                            <TableCell>{widget.author}</TableCell>
                            <TableCell>{new Date(widget.updatedAt).toLocaleDateString()}</TableCell>
                            <TableCell>{widget.category}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleOpenDetails(widget)}>
                                <Eye size={16} className="mr-1" /> View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <Card className="p-4">
              <div className="text-lg font-medium mb-2">Rejected Widgets</div>
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="h-6 w-6 border-t-2 border-b-2 border-widget-blue rounded-full animate-spin"></div>
                </div>
              ) : filteredWidgets.filter(w => w.status === 'rejected').length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg border">
                  <div className="mb-4 text-gray-400">No rejected widgets</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Rejected Date</TableHead>
                        <TableHead>Feedback</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredWidgets
                        .filter(widget => widget.status === 'rejected')
                        .map((widget) => (
                          <TableRow key={widget.id}>
                            <TableCell className="font-medium">{widget.name}</TableCell>
                            <TableCell>{widget.author}</TableCell>
                            <TableCell>{new Date(widget.updatedAt).toLocaleDateString()}</TableCell>
                            <TableCell className="max-w-xs truncate">{widget.feedback || "No feedback provided"}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleOpenDetails(widget)}>
                                <Eye size={16} className="mr-1" /> View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {selectedWidget && (
        <WidgetApprovalDetails 
          widget={selectedWidget}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          onApprove={handleApproveWidget}
          onReject={handleRejectWidget}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
