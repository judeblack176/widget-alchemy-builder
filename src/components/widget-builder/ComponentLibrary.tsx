import React, { useState } from "react";
import { ComponentType, ComponentDefinition } from "@/types/widget-types";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Type, 
  Image, 
  MousePointer, 
  Video, 
  BarChart, 
  FormInput, 
  CalendarDays, 
  List, 
  LinkIcon, 
  Text,
  Filter,
  AlertTriangle,
  Table2,
  Search,
  Plus
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { v4 as uuidv4 } from "uuid";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface ComponentLibraryProps {
  onAddComponent: (component: ComponentType) => void;
  onAddMultipleComponents: (components: ComponentType[]) => void;
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ 
  onAddComponent,
  onAddMultipleComponents
}) => {
  const [selectedComponents, setSelectedComponents] = useState<ComponentType[]>([]);
  
  const componentDefinitions: Record<ComponentType, ComponentDefinition> = {
    header: {
      type: "header",
      name: "Header",
      icon: "BookOpen",
      defaultProps: {
        title: "Widget Header",
        icon: "BookOpen",
        backgroundColor: "#3B82F6",
        textColor: "#FFFFFF"
      },
      availableProps: [
        { name: "title", type: "text", label: "Title" },
        { name: "icon", type: "icon", label: "Icon" },
        { name: "backgroundColor", type: "color", label: "Background Color" },
        { name: "textColor", type: "color", label: "Text Color" }
      ]
    },
    text: {
      type: "text",
      name: "Text",
      icon: "Type",
      defaultProps: {
        content: "Add your text content here",
        size: "medium",
        color: "#333333",
        fontStyle: ""
      },
      availableProps: [
        { name: "content", type: "text", label: "Content" },
        { name: "size", type: "select", label: "Size" },
        { name: "color", type: "color", label: "Text Color" },
        { name: "fontStyle", type: "select", label: "Font Style" }
      ]
    },
    button: {
      type: "button",
      name: "Button",
      icon: "MousePointer",
      defaultProps: {
        label: "Click Me",
        variant: "default",
        backgroundColor: "#3B82F6",
        textColor: "#FFFFFF"
      },
      availableProps: [
        { name: "label", type: "text", label: "Label" },
        { name: "variant", type: "select", label: "Style" },
        { name: "backgroundColor", type: "color", label: "Background Color" },
        { name: "textColor", type: "color", label: "Text Color" }
      ]
    },
    image: {
      type: "image",
      name: "Image",
      icon: "Image",
      defaultProps: {
        source: "https://via.placeholder.com/300",
        altText: "Image description",
        width: "100%",
        height: "auto"
      },
      availableProps: [
        { name: "source", type: "text", label: "Image URL" },
        { name: "altText", type: "text", label: "Alt Text" },
        { name: "width", type: "select", label: "Width" },
        { name: "height", type: "select", label: "Height" }
      ]
    },
    video: {
      type: "video",
      name: "Video",
      icon: "Video",
      defaultProps: {
        source: "https://example.com/video.mp4",
        controls: true,
        autoplay: false
      },
      availableProps: [
        { name: "source", type: "text", label: "Video URL" },
        { name: "controls", type: "select", label: "Show Controls" },
        { name: "autoplay", type: "select", label: "Autoplay" }
      ]
    },
    chart: {
      type: "chart",
      name: "Chart",
      icon: "BarChart",
      defaultProps: {
        chartType: "bar",
        title: "Chart Title",
        data: [10, 20, 30, 40],
        labels: ["Q1", "Q2", "Q3", "Q4"]
      },
      availableProps: [
        { name: "chartType", type: "select", label: "Chart Type" },
        { name: "title", type: "text", label: "Title" },
        { name: "data", type: "text", label: "Data" },
        { name: "labels", type: "text", label: "Labels" }
      ],
      supportsApiIntegration: true
    },
    form: {
      type: "form",
      name: "Form Input",
      icon: "FormInput",
      defaultProps: {
        label: "Input Label",
        placeholder: "Enter value...",
        fieldType: "text"
      },
      availableProps: [
        { name: "label", type: "text", label: "Label" },
        { name: "placeholder", type: "text", label: "Placeholder" },
        { name: "fieldType", type: "select", label: "Field Type" }
      ]
    },
    calendar: {
      type: "calendar",
      name: "Calendar",
      icon: "CalendarDays",
      defaultProps: {
        calendarType: "date-picker",
        label: "Select Date"
      },
      availableProps: [
        { name: "calendarType", type: "select", label: "Calendar Type" },
        { name: "label", type: "text", label: "Label" }
      ],
      supportsApiIntegration: true
    },
    dropdown: {
      type: "dropdown",
      name: "Dropdown",
      icon: "List",
      defaultProps: {
        label: "Select an option",
        options: "Option 1,Option 2,Option 3",
        placeholder: "Choose..."
      },
      availableProps: [
        { name: "label", type: "text", label: "Label" },
        { name: "options", type: "text", label: "Options" },
        { name: "placeholder", type: "text", label: "Placeholder" }
      ],
      supportsApiIntegration: true
    },
    link: {
      type: "link",
      name: "Link",
      icon: "LinkIcon",
      defaultProps: {
        text: "Click here",
        url: "https://example.com",
        openInNewTab: true
      },
      availableProps: [
        { name: "text", type: "text", label: "Text" },
        { name: "url", type: "text", label: "URL" },
        { name: "openInNewTab", type: "select", label: "Open in New Tab" }
      ]
    },
    "multi-text": {
      type: "multi-text",
      name: "Multi-line Text",
      icon: "Text",
      defaultProps: {
        label: "Text Area",
        placeholder: "Enter text here...",
        rows: 4
      },
      availableProps: [
        { name: "label", type: "text", label: "Label" },
        { name: "placeholder", type: "text", label: "Placeholder" },
        { name: "rows", type: "number", label: "Rows" }
      ]
    },
    filter: {
      type: "filter",
      name: "Filter",
      icon: "Filter",
      defaultProps: {
        label: "Filter",
        placeholder: "Filter items..."
      },
      availableProps: [
        { name: "label", type: "text", label: "Label" },
        { name: "placeholder", type: "text", label: "Placeholder" }
      ]
    },
    alert: {
      type: "alert",
      name: "Alert",
      icon: "AlertTriangle",
      defaultProps: {
        title: "Alert Title",
        message: "This is an alert message.",
        type: "info",
        dismissible: true
      },
      availableProps: [
        { name: "title", type: "text", label: "Title" },
        { name: "message", type: "text", label: "Message" },
        { name: "type", type: "select", label: "Alert Type" },
        { name: "dismissible", type: "select", label: "Dismissible" }
      ],
      supportsApiIntegration: true
    },
    table: {
      type: "table",
      name: "Table",
      icon: "Table2",
      defaultProps: {
        columns: [
          { header: "Name", accessor: "name" },
          { header: "Age", accessor: "age" },
          { header: "Status", accessor: "status" }
        ],
        data: [
          { name: "John Doe", age: 28, status: "Active" },
          { name: "Jane Smith", age: 32, status: "Inactive" }
        ]
      },
      availableProps: [
        { name: "columns", type: "text", label: "Columns" },
        { name: "data", type: "text", label: "Data" },
        { name: "striped", type: "select", label: "Striped Rows" },
        { name: "bordered", type: "select", label: "Bordered" }
      ],
      supportsApiIntegration: true
    },
    searchbar: {
      type: "searchbar",
      name: "Search Bar",
      icon: "Search",
      defaultProps: {
        placeholder: "Search...",
        showIcon: true
      },
      availableProps: [
        { name: "placeholder", type: "text", label: "Placeholder" },
        { name: "showIcon", type: "select", label: "Show Icon" }
      ],
      supportsApiIntegration: true
    }
  };

  const toggleComponentSelection = (componentType: ComponentType) => {
    setSelectedComponents(prev => {
      if (prev.includes(componentType)) {
        return prev.filter(type => type !== componentType);
      } else {
        return [...prev, componentType];
      }
    });
  };

  const handleAddSelectedComponents = () => {
    if (selectedComponents.length > 0) {
      onAddMultipleComponents(selectedComponents);
      setSelectedComponents([]);
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
        <h3 className="font-medium">Components</h3>
        {selectedComponents.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-normal">
              {selectedComponents.length} selected
            </Badge>
            <Button 
              size="sm" 
              onClick={handleAddSelectedComponents}
              className="flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              Add Selected
            </Button>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="w-full rounded-none border-b grid grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="m-0">
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-2 gap-2 p-3">
              {Object.entries(componentDefinitions).map(([type, definition]) => (
                <div 
                  key={type}
                  className="relative border rounded-md p-2 hover:bg-gray-50 cursor-pointer flex flex-col items-center transition-colors"
                >
                  <Checkbox
                    checked={selectedComponents.includes(type as ComponentType)}
                    onCheckedChange={() => toggleComponentSelection(type as ComponentType)}
                    className="absolute top-2 right-2"
                  />
                  
                  <div 
                    className="w-full flex flex-col items-center pt-3 pb-1"
                    onClick={() => onAddComponent(type as ComponentType)}
                  >
                    {getComponentIcon(definition.icon)}
                    <span className="mt-1 text-sm font-medium">{definition.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="text" className="m-0">
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-2 gap-2 p-3">
              {Object.entries(componentDefinitions)
                .filter(([type]) => ["text", "header"].includes(type))
                .map(([type, definition]) => (
                  <div 
                    key={type}
                    className="relative border rounded-md p-2 hover:bg-gray-50 cursor-pointer flex flex-col items-center transition-colors"
                  >
                    <Checkbox
                      checked={selectedComponents.includes(type as ComponentType)}
                      onCheckedChange={() => toggleComponentSelection(type as ComponentType)}
                      className="absolute top-2 right-2"
                    />
                    
                    <div 
                      className="w-full flex flex-col items-center pt-3 pb-1"
                      onClick={() => onAddComponent(type as ComponentType)}
                    >
                      {getComponentIcon(definition.icon)}
                      <span className="mt-1 text-sm font-medium">{definition.name}</span>
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="media" className="m-0">
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-2 gap-2 p-3">
              {Object.entries(componentDefinitions)
                .filter(([type]) => ["image", "video"].includes(type))
                .map(([type, definition]) => (
                  <div 
                    key={type}
                    className="relative border rounded-md p-2 hover:bg-gray-50 cursor-pointer flex flex-col items-center transition-colors"
                  >
                    <Checkbox
                      checked={selectedComponents.includes(type as ComponentType)}
                      onCheckedChange={() => toggleComponentSelection(type as ComponentType)}
                      className="absolute top-2 right-2"
                    />
                    
                    <div 
                      className="w-full flex flex-col items-center pt-3 pb-1"
                      onClick={() => onAddComponent(type as ComponentType)}
                    >
                      {getComponentIcon(definition.icon)}
                      <span className="mt-1 text-sm font-medium">{definition.name}</span>
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const getComponentIcon = (iconName: string) => {
  switch (iconName) {
    case "BookOpen": return <BookOpen className="h-5 w-5 text-gray-500" />;
    case "Type": return <Type className="h-5 w-5 text-gray-500" />;
    case "Image": return <Image className="h-5 w-5 text-gray-500" />;
    case "MousePointer": return <MousePointer className="h-5 w-5 text-gray-500" />;
    case "Video": return <Video className="h-5 w-5 text-gray-500" />;
    case "BarChart": return <BarChart className="h-5 w-5 text-gray-500" />;
    case "FormInput": return <FormInput className="h-5 w-5 text-gray-500" />;
    case "CalendarDays": return <CalendarDays className="h-5 w-5 text-gray-500" />;
    case "List": return <List className="h-5 w-5 text-gray-500" />;
    case "LinkIcon": return <LinkIcon className="h-5 w-5 text-gray-500" />;
    case "Text": return <Text className="h-5 w-5 text-gray-500" />;
    case "Filter": return <Filter className="h-5 w-5 text-gray-500" />;
    case "AlertTriangle": return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    case "Table2": return <Table2 className="h-5 w-5 text-gray-500" />;
    case "Search": return <Search className="h-5 w-5 text-gray-500" />;
    default: return <BookOpen className="h-5 w-5 text-gray-500" />;
  }
};

export default ComponentLibrary;
