import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, Check, X, Filter, Search, ArrowLeft, Eye, ShieldCheck, 
  ListFilter, Grid, Calendar, Tag, ArrowUpDown
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { WidgetSubmission, WidgetApprovalStatus } from "@/types/widget-types";

const WidgetLibrary = () => {
  const { toast } = useToast();
  const [widgets, setWidgets] = useState<WidgetSubmission[]>([]);
  const [filteredWidgets, setFilteredWidgets] = useState<WidgetSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "tile">("list");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [tagFilter, setTagFilter] = useState<string>("all_tags");
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWidgets = () => {
      setLoading(true);
      try {
        const savedWidgets = localStorage.getItem('widgetSubmissions');
        if (savedWidgets) {
          const parsedWidgets = JSON.parse(savedWidgets);
          setWidgets(parsedWidgets);
          
          const tags = new Set<string>();
          parsedWidgets.forEach((widget: WidgetSubmission) => {
            if (widget.tags) {
              widget.tags.forEach(tag => tags.add(tag));
            }
          });
          setAvailableTags(Array.from(tags));
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
      } finally {
        setLoading(false);
      }
    };

    loadWidgets();
  }, [toast]);

  useEffect(() => {
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
    
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filterDate.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(widget => {
        const widgetDate = new Date(widget.createdAt);
        widgetDate.setHours(0, 0, 0, 0);
        return widgetDate.getTime() === filterDate.getTime();
      });
    }
    
    if (tagFilter && tagFilter !== "all_tags") {
      filtered = filtered.filter(
        widget => widget.tags && widget.tags.includes(tagFilter)
      );
    }
    
    setFilteredWidgets(filtered);
  }, [widgets, searchQuery, statusFilter, dateFilter, tagFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFilter(undefined);
    setTagFilter("all_tags");
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
            <Link to="/admin/login">
              <Button variant="secondary">
                <ShieldCheck size={16} className="mr-2" /> Admin
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="mr-2">Create New Widget</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-6 flex-1 overflow-auto">
        <Card className="p-4 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="relative flex-1 w-full md:w-auto">
                <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search widgets..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "list" | "tile")}>
                  <ToggleGroupItem value="list" aria-label="List View">
                    <ListFilter className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="tile" aria-label="Tile View">
                    <Grid className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10">
                      <Calendar className="h-4 w-4 mr-2" />
                      {dateFilter ? format(dateFilter, 'PPP') : 'Filter by date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <CalendarComponent
                      mode="single"
                      selected={dateFilter}
                      onSelect={setDateFilter}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Select value={tagFilter} onValueChange={setTagFilter}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center">
                      <Tag size={14} className="mr-2" />
                      <SelectValue placeholder="Filter by tag" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_tags">All Tags</SelectItem>
                    {availableTags.map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
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
                
                {(searchQuery || statusFilter !== "all" || dateFilter || tagFilter !== "all_tags") && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
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
        ) : viewMode === "list" ? (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWidgets.map((widget) => (
              <Card key={widget.id} className="overflow-hidden flex flex-col">
                <CardHeader className="pb-2 border-b">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{widget.name}</CardTitle>
                    {getStatusBadge(widget.status)}
                  </div>
                </CardHeader>
                
                <div className="p-4 flex justify-center items-center bg-gray-50">
                  <div className="w-64 h-64 border rounded-md shadow-sm bg-white flex items-center justify-center overflow-hidden">
                    {widget.thumbnail ? (
                      <img 
                        src={widget.thumbnail} 
                        alt={`${widget.name} preview`} 
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center mx-auto mb-2">
                          <Eye className="h-8 w-8 text-gray-400" />
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
                  <div className="flex flex-wrap gap-1 mt-2">
                    {widget.tags && widget.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 pt-2 mt-auto">
                  <div className="flex justify-between w-full">
                    <Badge variant="outline">v{widget.version}</Badge>
                    <div className="flex space-x-2">
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
                      <Link to={`/?widgetId=${widget.id}`}>
                        <Button variant="default" size="sm">
                          <Eye size={14} className="mr-1" /> View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetLibrary;
