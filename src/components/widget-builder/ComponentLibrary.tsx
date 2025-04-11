import React from "react";
import { ComponentDefinition, WidgetComponent, FontFamily } from "@/types/widget-types";
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
  Italic
} from "lucide-react";

interface ComponentLibraryProps {
  onAddComponent: (component: WidgetComponent) => void;
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onAddComponent }) => {
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
        {componentDefinitions.map((definition) => (
          <Card 
            key={definition.type} 
            className="cursor-pointer hover:border-widget-blue transition-colors"
            onClick={() => handleAddComponent(definition)}
          >
            <div className="flex p-3 items-center">
              <div className="mr-3 text-widget-blue">
                {getIconComponent(definition.icon)}
              </div>
              <div>
                <h4 className="font-medium">{definition.name}</h4>
                <p className="text-xs text-gray-500">Click to add</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ComponentLibrary;
