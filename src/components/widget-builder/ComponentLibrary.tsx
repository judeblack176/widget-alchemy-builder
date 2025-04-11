import React from "react";
import { ComponentDefinition, WidgetComponent, FontFamily, PREDEFINED_COLORS } from "@/types/widget-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Type, 
  Image, 
  Video, 
  BarChart, 
  MousePointer, 
  FormInput, 
  CalendarDays, 
  List, 
  Link as LinkIcon, 
  Text,
  Palette,
  Bold,
  Italic,
  Filter,
  AlertTriangle,
  Table2,
  Search,
  GripVertical,
  XCircle
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Draggable } from 'react-beautiful-dnd';

interface ComponentLibraryProps {
  onAddComponent: (component: WidgetComponent) => void;
  existingComponents?: WidgetComponent[];
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onAddComponent, existingComponents = [] }) => {
  const hasAlertComponent = existingComponents.some(c => c.type === 'alert');
  
  const componentDefinitions: ComponentDefinition[] = [
    {
      type: "header",
      name: "Header Bar",
      icon: "BookOpen",
      defaultProps: {
        icon: "BookOpen",
        title: "Widget Title",
        actions: ["Edit", "More"],
        backgroundColor: "#3B82F6",
        textColor: "#FFFFFF",
        fontFamily: "system-ui",
        bold: false,
        italic: false
      },
      availableProps: [
        { name: "icon", type: "icon", label: "Icon" },
        { name: "title", type: "text", label: "Title" },
        { name: "actions", type: "select", label: "Actions", options: ["None", "Edit", "More", "Both"] },
        { name: "backgroundColor", type: "color", label: "Background Color" },
        { name: "textColor", type: "color", label: "Text Color" },
        { name: "fontFamily", type: "font", label: "Font Family", options: [
          "Arial", "Helvetica", "Times New Roman", "Georgia", "Courier New",
          "Verdana", "Tahoma", "Trebuchet MS", "Impact", "Comic Sans MS",
          "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins", 
          "Playfair Display", "Merriweather", "system-ui"
        ]},
        { name: "bold", type: "select", label: "Bold", options: ["true", "false"] },
        { name: "italic", type: "select", label: "Italic", options: ["true", "false"] }
      ]
    },
    {
      type: "text",
      name: "Text Block",
      icon: "Type",
      defaultProps: {
        content: "Your text content here",
        size: "medium",
        color: "#333333",
        backgroundColor: "transparent",
        fontWeight: "normal",
        fontFamily: "system-ui",
        bold: false,
        italic: false
      },
      availableProps: [
        { name: "content", type: "text", label: "Content" },
        { name: "size", type: "select", label: "Size", options: ["small", "medium", "large"] },
        { name: "color", type: "color", label: "Text Color" },
        { name: "backgroundColor", type: "color", label: "Background Color" },
        { name: "fontWeight", type: "select", label: "Font Weight", options: ["normal", "bold", "light"] },
        { name: "fontFamily", type: "font", label: "Font Family", options: [
          "Arial", "Helvetica", "Times New Roman", "Georgia", "Courier New",
          "Verdana", "Tahoma", "Trebuchet MS", "Impact", "Comic Sans MS",
          "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins", 
          "Playfair Display", "Merriweather", "system-ui"
        ]},
        { name: "bold", type: "select", label: "Bold", options: ["true", "false"] },
        { name: "italic", type: "select", label: "Italic", options: ["true", "false"] }
      ]
    },
    {
      type: "image",
      name: "Image",
      icon: "Image",
      defaultProps: {
        source: "https://via.placeholder.com/150",
        altText: "Image description",
        caption: ""
      },
      availableProps: [
        { name: "source", type: "text", label: "Image URL" },
        { name: "altText", type: "text", label: "Alt Text" },
        { name: "caption", type: "text", label: "Caption" }
      ]
    },
    {
      type: "button",
      name: "Button",
      icon: "MousePointer",
      defaultProps: {
        label: "Click me",
        style: "primary",
        action: "none",
        backgroundColor: "#3B82F6",
        textColor: "#FFFFFF"
      },
      availableProps: [
        { name: "label", type: "text", label: "Label" },
        { name: "style", type: "select", label: "Style", options: ["primary", "secondary", "outline"] },
        { name: "action", type: "text", label: "Action" },
        { name: "backgroundColor", type: "color", label: "Background Color" },
        { name: "textColor", type: "color", label: "Text Color" }
      ]
    },
    {
      type: "video",
      name: "Video Player",
      icon: "Video",
      defaultProps: {
        source: "https://example.com/video.mp4",
        autoplay: false,
        controls: true
      },
      availableProps: [
        { name: "source", type: "text", label: "Video URL" },
        { name: "autoplay", type: "select", label: "Autoplay", options: ["true", "false"] },
        { name: "controls", type: "select", label: "Show Controls", options: ["true", "false"] }
      ]
    },
    {
      type: "chart",
      name: "Chart",
      icon: "BarChart",
      defaultProps: {
        type: "bar",
        data: [10, 20, 30, 40],
        labels: ["A", "B", "C", "D"],
        colors: ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"],
        backgroundColor: "#FFFFFF",
        borderColor: "#E5E7EB",
        legendPosition: "top"
      },
      availableProps: [
        { name: "type", type: "select", label: "Chart Type", options: ["bar", "line", "pie", "doughnut", "radar"] },
        { name: "data", type: "text", label: "Data Values (comma separated)" },
        { name: "labels", type: "text", label: "Labels (comma separated)" },
        { name: "colors", type: "text", label: "Chart Colors (comma separated hex)" },
        { name: "backgroundColor", type: "color", label: "Background Color" },
        { name: "borderColor", type: "color", label: "Border Color" },
        { name: "legendPosition", type: "select", label: "Legend Position", options: ["top", "right", "bottom", "left", "none"] }
      ]
    },
    {
      type: "form",
      name: "Form Input",
      icon: "FormInput",
      defaultProps: {
        fieldType: "text",
        label: "Input field",
        placeholder: "Enter value..."
      },
      availableProps: [
        { name: "fieldType", type: "select", label: "Field Type", options: ["text", "number", "select", "textarea"] },
        { name: "label", type: "text", label: "Label" },
        { name: "placeholder", type: "text", label: "Placeholder" }
      ]
    },
    {
      type: "calendar",
      name: "Calendar",
      icon: "CalendarDays",
      defaultProps: {
        label: "Select Date",
        placeholder: "Pick a date",
        initialDate: "",
        calendarIntegration: {
          serviceType: "none",
          syncEnabled: false
        },
        allowExternalSync: false,
        icsConfig: {
          enabled: false,
          importEnabled: false,
          exportEnabled: false,
          allowSubscribe: false,
          icsUrl: "",
          syncInterval: "daily"
        }
      },
      availableProps: [
        { name: "label", type: "text", label: "Label" },
        { name: "placeholder", type: "text", label: "Placeholder" },
        { name: "initialDate", type: "text", label: "Initial Date (YYYY-MM-DD)" },
        { name: "allowExternalSync", type: "select", label: "Allow External Calendar Sync", options: ["true", "false"] },
        { name: "calendarIntegration.serviceType", type: "select", label: "Calendar Service", 
          options: ["none", "google", "outlook", "apple", "custom"] }
      ]
    },
    {
      type: "dropdown",
      name: "Dropdown Menu",
      icon: "List",
      defaultProps: {
        label: "Dropdown",
        options: ["Option 1", "Option 2", "Option 3"],
        placeholder: "Select an option"
      },
      availableProps: [
        { name: "label", type: "text", label: "Label" },
        { name: "options", type: "text", label: "Options (comma separated)" },
        { name: "placeholder", type: "text", label: "Placeholder" }
      ]
    },
    {
      type: "link",
      name: "Link",
      icon: "LinkIcon",
      defaultProps: {
        text: "Click here",
        url: "https://example.com",
        openInNewTab: true,
        style: "default"
      },
      availableProps: [
        { name: "text", type: "text", label: "Link Text" },
        { name: "url", type: "text", label: "URL" },
        { name: "openInNewTab", type: "select", label: "Open in New Tab", options: ["true", "false"] },
        { name: "style", type: "select", label: "Style", options: ["default", "button", "underlined"] }
      ]
    },
    {
      type: "multi-text",
      name: "Multi-line Text",
      icon: "Text",
      defaultProps: {
        label: "Multi-line Input",
        placeholder: "Type your text here...",
        rows: 4
      },
      availableProps: [
        { name: "label", type: "text", label: "Label" },
        { name: "placeholder", type: "text", label: "Placeholder" },
        { name: "rows", type: "number", label: "Number of Rows" }
      ]
    },
    {
      type: "filter",
      name: "Filter Component",
      icon: "Filter",
      defaultProps: {
        label: "Filter",
        placeholder: "Filter items...",
        options: ["All", "Option 1", "Option 2", "Option 3"],
        multiple: false,
        searchable: true,
        backgroundColor: "#FFFFFF",
        textColor: "#333333",
        accentColor: "#3B82F6",
        borderColor: "#E2E8F0"
      },
      availableProps: [
        { name: "label", type: "text", label: "Label" },
        { name: "placeholder", type: "text", label: "Placeholder" },
        { name: "options", type: "text", label: "Options (comma separated)" },
        { name: "multiple", type: "select", label: "Allow Multiple Selection", options: ["true", "false"] },
        { name: "searchable", type: "select", label: "Allow Search", options: ["true", "false"] },
        { name: "backgroundColor", type: "color", label: "Background Color" },
        { name: "textColor", type: "color", label: "Text Color" },
        { name: "accentColor", type: "color", label: "Accent Color" },
        { name: "borderColor", type: "color", label: "Border Color" }
      ]
    },
    {
      type: "alert",
      name: "Alert Bar",
      icon: "AlertTriangle",
      defaultProps: {
        title: "Alert Title",
        message: "This is an alert message.",
        type: "info",
        icon: true,
        dismissible: true,
        backgroundColor: "#EFF6FF",
        textColor: "#1E3A8A",
        borderColor: "#BFDBFE"
      },
      availableProps: [
        { name: "title", type: "text", label: "Title" },
        { name: "message", type: "text", label: "Message" },
        { name: "type", type: "select", label: "Alert Type", options: ["info", "success", "warning", "error"] },
        { name: "icon", type: "select", label: "Show Icon", options: ["true", "false"] },
        { name: "dismissible", type: "select", label: "Dismissible", options: ["true", "false"] },
        { name: "backgroundColor", type: "color", label: "Background Color" },
        { name: "textColor", type: "color", label: "Text Color" },
        { name: "borderColor", type: "color", label: "Border Color" }
      ]
    },
    {
      type: "table",
      name: "Table",
      icon: "Table2",
      defaultProps: {
        columns: [
          { header: "Name", accessor: "name", type: "text" },
          { header: "Age", accessor: "age", type: "number" },
          { header: "Status", accessor: "status", type: "text" }
        ],
        data: [
          { name: "John Doe", age: 28, status: "Active" },
          { name: "Jane Smith", age: 32, status: "Inactive" },
          { name: "Bob Johnson", age: 45, status: "Active" }
        ],
        striped: true,
        hoverable: true,
        bordered: false,
        compact: false,
        headerBackgroundColor: "#F8FAFC",
        headerTextColor: "#334155",
        rowBackgroundColor: "#FFFFFF",
        rowTextColor: "#1E293B",
        borderColor: "#E2E8F0",
        altRowBackgroundColor: "#F1F5F9"
      },
      availableProps: [
        { name: "columns", type: "text", label: "Columns (JSON)" },
        { name: "data", type: "text", label: "Data (JSON)" },
        { name: "striped", type: "select", label: "Striped Rows", options: ["true", "false"] },
        { name: "hoverable", type: "select", label: "Hoverable Rows", options: ["true", "false"] },
        { name: "bordered", type: "select", label: "Bordered Cells", options: ["true", "false"] },
        { name: "compact", type: "select", label: "Compact Layout", options: ["true", "false"] },
        { name: "headerBackgroundColor", type: "color", label: "Header Background Color" },
        { name: "headerTextColor", type: "color", label: "Header Text Color" },
        { name: "rowBackgroundColor", type: "color", label: "Row Background Color" },
        { name: "rowTextColor", type: "color", label: "Row Text Color" },
        { name: "borderColor", type: "color", label: "Border Color" },
        { name: "altRowBackgroundColor", type: "color", label: "Alt Row Background Color" }
      ]
    },
    {
      type: "searchbar",
      name: "Search Bar",
      icon: "Search",
      defaultProps: {
        placeholder: "Search...",
        backgroundColor: "#FFFFFF",
        textColor: "#333333",
        borderColor: "#E2E8F0",
        width: "full",
        iconColor: "#6B7280",
        showIcon: true
      },
      availableProps: [
        { name: "placeholder", type: "text", label: "Placeholder" },
        { name: "backgroundColor", type: "color", label: "Background Color" },
        { name: "textColor", type: "color", label: "Text Color" },
        { name: "borderColor", type: "color", label: "Border Color" },
        { name: "width", type: "select", label: "Width", options: ["full", "medium", "small"] },
        { name: "iconColor", type: "color", label: "Icon Color" },
        { name: "showIcon", type: "select", label: "Show Icon", options: ["true", "false"] }
      ]
    }
  ];

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "BookOpen": return <BookOpen size={24} />;
      case "Type": return <Type size={24} />;
      case "Image": return <Image size={24} />;
      case "MousePointer": return <MousePointer size={24} />;
      case "Video": return <Video size={24} />;
      case "BarChart": return <BarChart size={24} />;
      case "FormInput": return <FormInput size={24} />;
      case "CalendarDays": return <CalendarDays size={24} />;
      case "List": return <List size={24} />;
      case "LinkIcon": return <LinkIcon size={24} />;
      case "Text": return <Text size={24} />;
      case "Palette": return <Palette size={24} />;
      case "Bold": return <Bold size={24} />;
      case "Italic": return <Italic size={24} />;
      case "Filter": return <Filter size={24} />;
      case "AlertTriangle": return <AlertTriangle size={24} />;
      case "Table2": return <Table2 size={24} />;
      case "Search": return <Search size={24} />;
      default: return <div className="w-6 h-6 bg-gray-200 rounded" />;
    }
  };

  const handleAddComponent = (definition: ComponentDefinition) => {
    const newComponent: WidgetComponent = {
      id: `${definition.type}-${Date.now()}`,
      type: definition.type,
      props: { ...definition.defaultProps }
    };
    
    onAddComponent(newComponent);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700">Drag & drop components to build your widget</h3>
      
      <div className="grid grid-cols-1 gap-3">
        {componentDefinitions.map((definition, index) => {
          const isDisabled = definition.type === 'alert' && hasAlertComponent;
          
          return (
            <Draggable
              key={definition.type}
              draggableId={definition.type}
              index={index}
              isDragDisabled={isDisabled}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="relative"
                >
                  <Card 
                    data-component-type={definition.type}
                    className={`cursor-pointer transition-colors ${
                      isDisabled ? 'opacity-50 border-gray-300 cursor-not-allowed' : 'hover:border-widget-blue'
                    } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                    onClick={() => !isDisabled && handleAddComponent(definition)}
                  >
                    <div className="flex p-3 items-center">
                      <div className={`mr-3 ${isDisabled ? 'text-gray-400' : 'text-widget-blue'}`}>
                        {getIconComponent(definition.icon)}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${isDisabled ? 'text-gray-400' : ''}`}>
                          {definition.name}
                          {isDisabled && <span className="ml-2 text-xs text-red-500">(Already added)</span>}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {isDisabled ? 'Only one alert allowed' : 'Click or drag to add'}
                        </p>
                      </div>
                      <div className="text-gray-400">
                        {isDisabled ? <XCircle size={16} className="text-red-500" /> : <GripVertical size={16} />}
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </Draggable>
          );
        })}
      </div>
    </div>
  );
};

export default ComponentLibrary;
