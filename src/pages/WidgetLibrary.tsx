
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Check, X, Filter, Search, ArrowLeft, Eye, ShieldCheck } from "lucide-react";
import type { WidgetSubmission, WidgetApprovalStatus } from "@/types/widget-types";

const WidgetLibrary = () => {
  const { toast } = useToast();
  const [widgets, setWidgets] = useState<WidgetSubmission[]>([]);
  const [filteredWidgets, setFilteredWidgets] = useState<WidgetSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would fetch from an API
    // For now, load from localStorage if available
    const loadWidgets = () => {
      setLoading(true);
      try {
        const savedWidgets = localStorage.getItem('widgetSubmissions');
        if (savedWidgets) {
          setWidgets(JSON.parse(savedWidgets));
        } else {
          // Initialize with some example data if empty
          setWidgets([]);
        }
      } catch (error) {
        console.error("Failed to load widgets", error);
        toast({
          title: "Error",
          description: "Failed to load widgets",
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

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mr-2">
                <ArrowLeft size={16} className="mr-1" /> Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-widget-blue">Widget Library</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="outline" className="mr-2">Create New Widget</Button>
            </Link>
            <Link to="/admin/login">
              <Button variant="secondary">
                <ShieldCheck size={16} className="mr-2" /> Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-6 flex-1 overflow-auto">
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search widgets..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Filter size={14} className="mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending Approval</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="h-6 w-6 border-t-2 border-b-2 border-widget-blue rounded-full animate-spin"></div>
          </div>
        ) : filteredWidgets.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg border">
            <div className="mb-4 text-gray-400">
              {widgets.length === 0 ? 
                "No widgets have been created yet" : 
                "No widgets match your filter criteria"}
            </div>
            <Link to="/">
              <Button>Create Your First Widget</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWidgets.map((widget) => (
                  <TableRow key={widget.id}>
                    <TableCell className="font-medium">{widget.name}</TableCell>
                    <TableCell>{new Date(widget.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(widget.status)}</TableCell>
                    <TableCell>{widget.version}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/?widgetId=${widget.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye size={16} className="mr-1" /> View
                          </Button>
                        </Link>
                        {widget.status === 'rejected' && (
                          <Button variant="ghost" size="sm" 
                            onClick={() => {
                              toast({
                                title: "Feedback",
                                description: widget.feedback || "No feedback provided"
                              });
                            }}
                          >
                            Feedback
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetLibrary;
