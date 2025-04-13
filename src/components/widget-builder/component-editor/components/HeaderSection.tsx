
import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import ComponentHeader from "../../component-header/ComponentHeader";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface HeaderSectionProps {
  component: WidgetComponent;
  componentTypeLabels: Record<string, string>;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRemove: (componentId: string) => void;
  showActionButtons: boolean;
  disableRemove: boolean;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  component,
  componentTypeLabels,
  isExpanded,
  onToggleExpand,
  onRemove,
  showActionButtons,
  disableRemove
}) => {
  return (
    <div 
      className="cursor-pointer w-full relative" 
      onClick={onToggleExpand}
    >
      <ComponentHeader 
        component={component}
        componentTypeLabels={componentTypeLabels}
        isExpanded={isExpanded} 
        onRemove={onRemove}
      />
      
      {/* Only show the remove button when component is not expanded and not disabled */}
      {!isExpanded && !disableRemove && showActionButtons && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(component.id);
          }}
          className="absolute top-3 right-3 h-8 w-8 p-0 text-gray-500 hover:text-red-500"
        >
          <Trash2 size={16} />
        </Button>
      )}
    </div>
  );
};

export default HeaderSection;
