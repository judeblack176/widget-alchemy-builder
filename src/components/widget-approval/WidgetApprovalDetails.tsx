
import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X, Clock, AlertCircle } from "lucide-react";
import type { WidgetSubmission, WidgetApprovalStatus } from "@/types/widget-types";

interface WidgetApprovalDetailsProps {
  widget: WidgetSubmission;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (widgetId: string) => void;
  onReject: (widgetId: string, feedback: string) => void;
}

export const WidgetApprovalDetails: React.FC<WidgetApprovalDetailsProps> = ({
  widget,
  isOpen,
  onClose,
  onApprove,
  onReject
}) => {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = () => {
    setIsSubmitting(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      onApprove(widget.id);
      setIsSubmitting(false);
    }, 500);
  };

  const handleReject = () => {
    if (!feedback.trim()) {
      alert("Please provide feedback for rejection");
      return;
    }
    
    setIsSubmitting(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      onReject(widget.id, feedback);
      setIsSubmitting(false);
    }, 500);
  };

  const getStatusBadge = (status: WidgetApprovalStatus) => {
    switch(status) {
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100 ml-2">Draft</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 ml-2">
          <Clock size={14} className="mr-1" /> Pending
        </Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 ml-2">
          <Check size={14} className="mr-1" /> Approved
        </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 ml-2">
          <X size={14} className="mr-1" /> Rejected
        </Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl w-full p-0 overflow-hidden">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 border-b">
            <div className="flex items-center">
              <SheetTitle className="text-xl">Widget Details</SheetTitle>
              {getStatusBadge(widget.status)}
            </div>
          </SheetHeader>
          
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{widget.name}</CardTitle>
                  <CardDescription>
                    Submitted by {widget.author} on {new Date(widget.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Description</h3>
                      <p className="mt-1">{widget.description || "No description provided"}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Category</h3>
                      <p className="mt-1">{widget.category}</p>
                    </div>
                    
                    {widget.tags && widget.tags.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {widget.tags.map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Version</h3>
                      <p className="mt-1">{widget.version}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="components">
                <TabsList className="w-full">
                  <TabsTrigger value="components" className="flex-1">Components</TabsTrigger>
                  <TabsTrigger value="apis" className="flex-1">APIs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="components" className="py-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Widget Components</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {widget.config.components.length === 0 ? (
                        <div className="text-center p-4 text-gray-500">No components</div>
                      ) : (
                        <div className="space-y-2">
                          {widget.config.components.map((component, index) => (
                            <div key={component.id} className="p-3 border rounded-md">
                              <div className="font-medium">{index + 1}. {component.type.charAt(0).toUpperCase() + component.type.slice(1)}</div>
                              <div className="text-sm text-gray-500 mt-1">
                                {Object.keys(component.props).length} properties defined
                                {component.apiConfig && (
                                  <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700">
                                    API Connected
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="apis" className="py-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">API Configurations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {widget.config.apis.length === 0 ? (
                        <div className="text-center p-4 text-gray-500">No APIs configured</div>
                      ) : (
                        <div className="space-y-2">
                          {widget.config.apis.map((api) => (
                            <div key={api.id} className="p-3 border rounded-md">
                              <div className="font-medium">{api.name}</div>
                              <div className="text-sm text-gray-500 mt-1">
                                <span className="uppercase font-mono text-xs px-2 py-1 rounded bg-gray-100">{api.method}</span>
                                <span className="ml-2">{api.endpoint}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {widget.status === 'rejected' && widget.feedback && (
                <Card className="border-red-200 bg-red-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center text-red-700">
                      <AlertCircle size={16} className="mr-2" /> Rejection Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-700">{widget.feedback}</p>
                  </CardContent>
                </Card>
              )}

              {widget.status === 'pending' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Review Decision</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <Button 
                          onClick={handleApprove} 
                          className="w-full bg-green-600 hover:bg-green-700"
                          disabled={isSubmitting}
                        >
                          <Check size={16} className="mr-2" /> Approve
                        </Button>
                        <Button 
                          onClick={handleReject} 
                          variant="destructive" 
                          className="w-full"
                          disabled={isSubmitting || !feedback.trim()}
                        >
                          <X size={16} className="mr-2" /> Reject
                        </Button>
                      </div>
                      
                      <div>
                        <Textarea
                          placeholder="Provide feedback to the widget author (required for rejection)"
                          className="min-h-[120px]"
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};
