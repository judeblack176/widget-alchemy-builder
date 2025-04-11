
import React from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { 
  BookOpen, 
  Type, 
  Image, 
  Video, 
  BarChart, 
  FileText, 
  FormInput, 
  MousePointer,
  Edit,
  MoreHorizontal
} from "lucide-react";

interface WidgetPreviewProps {
  components: WidgetComponent[];
  apis: ApiConfig[];
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ components, apis }) => {
  // Helper function to render the component based on its type
  const renderComponent = (component: WidgetComponent) => {
    switch (component.type) {
      case "header":
        return (
          <div className="bg-widget-blue text-white p-3 flex justify-between items-center rounded-t-md">
            <div className="flex items-center">
              {component.props.icon === "BookOpen" && <BookOpen size={18} className="mr-2" />}
              {component.props.icon === "Type" && <Type size={18} className="mr-2" />}
              {component.props.icon === "Image" && <Image size={18} className="mr-2" />}
              {component.props.icon === "Video" && <Video size={18} className="mr-2" />}
              {component.props.icon === "FileText" && <FileText size={18} className="mr-2" />}
              {component.props.icon === "BarChart" && <BarChart size={18} className="mr-2" />}
              {component.props.icon === "FormInput" && <FormInput size={18} className="mr-2" />}
              <span className="font-medium">{component.props.title}</span>
            </div>
            <div className="flex space-x-1">
              {component.props.actions?.includes("Edit") && (
                <button className="p-1 hover:bg-blue-600 rounded">
                  <Edit size={16} />
                </button>
              )}
              {component.props.actions?.includes("More") && (
                <button className="p-1 hover:bg-blue-600 rounded">
                  <MoreHorizontal size={16} />
                </button>
              )}
            </div>
          </div>
        );
      
      case "text":
        return (
          <div 
            className="p-3" 
            style={{ 
              fontSize: component.props.size === "small" ? "0.875rem" : 
                      component.props.size === "large" ? "1.25rem" : "1rem",
              color: component.props.color || "#333333"
            }}
          >
            {component.props.content}
          </div>
        );
      
      case "image":
        return (
          <div className="p-3">
            <img 
              src={component.props.source} 
              alt={component.props.altText || "Widget image"} 
              className="w-full h-auto rounded-md"
            />
            {component.props.caption && (
              <p className="mt-1 text-sm text-gray-500 text-center">{component.props.caption}</p>
            )}
          </div>
        );
      
      case "button":
        const buttonStyles = {
          primary: "bg-widget-blue text-white hover:bg-blue-600",
          secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
          outline: "border border-widget-blue text-widget-blue hover:bg-blue-50"
        };
        
        return (
          <div className="p-3">
            <button 
              className={`px-4 py-2 rounded transition-colors w-full flex items-center justify-center ${
                buttonStyles[component.props.style as keyof typeof buttonStyles] || buttonStyles.primary
              }`}
            >
              <MousePointer size={16} className="mr-2" />
              {component.props.label}
            </button>
          </div>
        );
      
      case "video":
        return (
          <div className="p-3">
            <div className="bg-black aspect-video rounded-md flex items-center justify-center">
              <Video size={32} className="text-white" />
              <span className="ml-2 text-white">Video Player</span>
            </div>
          </div>
        );
      
      case "quiz":
        return (
          <div className="p-3">
            <div className="font-medium mb-2">{component.props.question}</div>
            <div className="space-y-2">
              {component.props.options?.map((option: string, index: number) => (
                <div 
                  key={index} 
                  className={`p-2 border rounded-md cursor-pointer hover:bg-gray-50 ${
                    index === component.props.correctAnswer ? "border-widget-blue" : ""
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        );
      
      case "chart":
        return (
          <div className="p-3">
            <div className="bg-gray-100 rounded-md p-3 h-[150px] flex items-center justify-center">
              <BarChart size={24} className="mr-2 text-widget-blue" />
              <span>{component.props.type.charAt(0).toUpperCase() + component.props.type.slice(1)} Chart</span>
            </div>
          </div>
        );
      
      case "form":
        return (
          <div className="p-3">
            <label className="block text-sm font-medium mb-1">
              {component.props.label}
            </label>
            {component.props.fieldType === "textarea" ? (
              <textarea 
                className="w-full p-2 border rounded-md" 
                placeholder={component.props.placeholder}
              />
            ) : component.props.fieldType === "select" ? (
              <select className="w-full p-2 border rounded-md">
                <option>Select an option...</option>
              </select>
            ) : (
              <input 
                type={component.props.fieldType} 
                className="w-full p-2 border rounded-md" 
                placeholder={component.props.placeholder}
              />
            )}
          </div>
        );
      
      default:
        return <div className="p-3">Unknown component type: {component.type}</div>;
    }
  };

  return (
    <div className="bg-white border border-widget-border rounded-md shadow-sm overflow-hidden" style={{ width: '316px', height: '384px', overflow: 'auto' }}>
      {components.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-400">
          <p>Widget preview will appear here</p>
        </div>
      ) : (
        <div>
          {components.map((component) => (
            <div key={component.id}>
              {renderComponent(component)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WidgetPreview;
