
import React from "react";
import { ComponentDefinition, WidgetComponent } from "@/types/widget-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Type, Image, Video, BarChart, FileText, MousePointer, FormInput } from "lucide-react";

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
        actions: ["Edit", "More"]
      },
      availableProps: [
        { name: "icon", type: "icon", label: "Icon" },
        { name: "title", type: "text", label: "Title" },
        { name: "actions", type: "select", label: "Actions", options: ["None", "Edit", "More", "Both"] }
      ]
    },
    {
      type: "text",
      name: "Text Block",
      icon: "Type",
      defaultProps: {
        content: "Your text content here",
        size: "medium",
        color: "#333333"
      },
      availableProps: [
        { name: "content", type: "text", label: "Content" },
        { name: "size", type: "select", label: "Size", options: ["small", "medium", "large"] },
        { name: "color", type: "color", label: "Color" }
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
        action: "none"
      },
      availableProps: [
        { name: "label", type: "text", label: "Label" },
        { name: "style", type: "select", label: "Style", options: ["primary", "secondary", "outline"] },
        { name: "action", type: "text", label: "Action" }
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
      type: "quiz",
      name: "Quiz Question",
      icon: "FileText",
      defaultProps: {
        question: "What is the answer?",
        options: ["Option 1", "Option 2", "Option 3"],
        correctAnswer: 0
      },
      availableProps: [
        { name: "question", type: "text", label: "Question" },
        { name: "options", type: "text", label: "Options (comma separated)" },
        { name: "correctAnswer", type: "number", label: "Correct Answer Index" }
      ]
    },
    {
      type: "chart",
      name: "Chart",
      icon: "BarChart",
      defaultProps: {
        type: "bar",
        data: [10, 20, 30, 40],
        labels: ["A", "B", "C", "D"]
      },
      availableProps: [
        { name: "type", type: "select", label: "Chart Type", options: ["bar", "line", "pie"] },
        { name: "data", type: "text", label: "Data Values (comma separated)" },
        { name: "labels", type: "text", label: "Labels (comma separated)" }
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
    }
  ];

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "BookOpen": return <BookOpen size={24} />;
      case "Type": return <Type size={24} />;
      case "Image": return <Image size={24} />;
      case "MousePointer": return <MousePointer size={24} />;
      case "Video": return <Video size={24} />;
      case "FileText": return <FileText size={24} />;
      case "BarChart": return <BarChart size={24} />;
      case "FormInput": return <FormInput size={24} />;
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
