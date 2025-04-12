
import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Type, 
  Image, 
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
  Search
} from 'lucide-react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ComponentHeaderProps {
  component: WidgetComponent;
  componentTypeLabels: Record<string, string>;
  isExpanded: boolean;
}

const ComponentHeader: React.FC<ComponentHeaderProps> = ({
  component,
  componentTypeLabels,
  isExpanded
}) => {
  // Function to get the appropriate icon based on component type
  const getComponentIcon = () => {
    switch (component.type) {
      case 'header': return <BookOpen size={16} />;
      case 'text': return <Text size={16} />;
      case 'button': return <FormInput size={16} />;
      case 'image': return <Image size={16} />;
      case 'video': return <Video size={16} />;
      case 'chart': return <BarChart size={16} />;
      case 'calendar': return <CalendarDays size={16} />;
      case 'dropdown': return <List size={16} />;
      case 'link': return <LinkIcon size={16} />;
      case 'multi-text': return <Type size={16} />;
      case 'filter': return <Filter size={16} />;
      case 'alert': return <AlertTriangle size={16} />;
      case 'table': return <Table2 size={16} />;
      case 'searchbar': return <Search size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  const getComponentTitle = () => {
    if (component.props?.title) {
      return component.props.title;
    }
    
    if (component.props?.label) {
      return component.props.label;
    }
    
    if (component.props?.text) {
      return component.props.text;
    }
    
    if (component.props?.content) {
      // Truncate content if too long
      const content = String(component.props.content);
      return content.length > 30 ? `${content.slice(0, 30)}...` : content;
    }
    
    return componentTypeLabels[component.type] || component.type;
  };

  return (
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 p-1.5 rounded mb-1">
            {getComponentIcon()}
          </div>
          <Badge variant="outline" className="text-xxs px-1.5 py-0 font-normal">
            {componentTypeLabels[component.type] || component.type}
          </Badge>
        </div>
        <div className="ml-1">
          <span className="font-medium text-sm">{getComponentTitle()}</span>
          {component.apiConfig && (
            <div className="mt-1">
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                API Connected
              </Badge>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center">
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
    </div>
  );
};

export default ComponentHeader;
