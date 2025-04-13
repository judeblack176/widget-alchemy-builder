
import React, { useState } from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { 
  Settings, 
  HelpCircle, 
  BookOpen, 
  Type, 
  Image, 
  Video, 
  BarChart, 
  MousePointer, 
  FormInput, 
  CalendarDays, 
  List, 
  LinkIcon, 
  Text,
  Palette,
  Bold,
  Italic,
  Filter,
  AlertTriangle,
  Table2,
  Search,
  Library,
  Bookmark,
  User,
  Info,
  Coffee,
  Bell,
  FileText,
  Globe,
  Home,
  Mail,
  Map,
  Phone,
  ShoppingBag,
  Star,
  X,
  Tag,
  ChevronDown,
  ChevronUp,
  Code,
  Database,
  Plus,
  Trash2
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Tooltip as CustomTooltip } from "./TooltipManager";
import ApiIntegrationSection from "./api-integration/ApiIntegrationSection";
import ComponentHeader from "./component-header/ComponentHeader";
import ContentFieldsManager from "./content-fields/ContentFieldsManager";
import TooltipSelector from "./tooltip/TooltipSelector";

interface ComponentEditorProps {
  component: WidgetComponent;
  apis: ApiConfig[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onRequestApiTemplate: () => void;
  onApplyTooltip?: (tooltipId: string) => void;
  disableRemove?: boolean;
  customTooltips?: CustomTooltip[];
  showActionButtons?: boolean;
}

const ComponentEditor: React.FC<ComponentEditorProps> = ({
  component,
  apis,
  isExpanded,
  onToggleExpand,
  onUpdateComponent,
  onRemoveComponent,
  onRequestApiTemplate,
  onApplyTooltip,
  disableRemove = false,
  customTooltips = [],
  showActionButtons = true
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const componentTypeLabels: Record<string, string> = {
    header: "Header",
    text: "Text",
    image: "Image",
    button: "Button",
    video: "Video",
    chart: "Chart",
    form: "Form",
    calendar: "Calendar",
    dropdown: "Dropdown",
    link: "Link",
    "multi-text": "Multi-Text",
    filter: "Filter",
    alert: "Alert",
    table: "Table",
    searchbar: "Search Bar"
  };

  const shouldShowDataIntegration = () => {
    const dataIntegrationComponents = ['text', 'alert', 'chart', 'calendar', 'multi-text', 'table', 'searchbar'];
    return dataIntegrationComponents.includes(component.type);
  };

  const shouldShowContentEditor = () => {
    const contentEditorComponents = ['text', 'alert', 'multi-text'];
    return contentEditorComponents.includes(component.type);
  };

  return (
    <div>
      <ComponentHeader 
        component={component}
        componentTypeLabels={componentTypeLabels}
        isExpanded={isExpanded} 
        onRemove={showActionButtons ? onRemoveComponent : undefined}
      />

      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Tooltip selector at top of expanded view */}
          {onApplyTooltip && (
            <TooltipSelector 
              component={component}
              customTooltips={customTooltips}
              onApplyTooltip={onApplyTooltip}
            />
          )}

          {/* API Integration Section - Always at the top */}
          {shouldShowDataIntegration() && (
            <ApiIntegrationSection 
              component={component}
              apis={apis}
              onUpdateComponent={onUpdateComponent}
              onRequestApiTemplate={onRequestApiTemplate}
            />
          )}

          {/* Content Fields Manager - Show for components that support formatted content */}
          {shouldShowContentEditor() && (
            <ContentFieldsManager 
              component={component}
              onUpdateComponent={onUpdateComponent}
            />
          )}

          {/* Action Buttons */}
          {showActionButtons && (
            <div className="flex justify-end space-x-2 border-t pt-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemoveComponent(component.id)}
                disabled={disableRemove}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 size={14} className="mr-1" />
                Remove
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComponentEditor;
