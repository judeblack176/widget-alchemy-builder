
import React, { useState } from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ColorPalettePicker from "./ColorPalettePicker";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Tooltip as CustomTooltip } from "./TooltipManager";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PropertyEditor from "./property-editor/PropertyEditor";
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
    const dataIntegrationComponents = ['calendar', 'chart', 'table', 'dropdown', 'alert', 'searchbar'];
    return dataIntegrationComponents.includes(component.type);
  };

  return (
    <div>
      <ComponentHeader 
        component={component}
        componentTypeLabels={componentTypeLabels}
        isExpanded={isExpanded} 
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

          {/* Property editor */}
          <PropertyEditor 
            component={component}
            onUpdateComponent={onUpdateComponent}
          />

          {/* API Integration Section */}
          {shouldShowDataIntegration() && (
            <ApiIntegrationSection 
              component={component}
              apis={apis}
              onUpdateComponent={onUpdateComponent}
              onRequestApiTemplate={onRequestApiTemplate}
            />
          )}

          {/* Content Fields Manager */}
          {component.type === 'text' && (
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
