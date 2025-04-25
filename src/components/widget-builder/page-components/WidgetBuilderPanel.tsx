
import React, { useState } from 'react';
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import WidgetBuilder from "@/components/widget-builder/widget-builder";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, ChevronDown, Library } from 'lucide-react';
import { Tooltip } from "@/components/widget-builder/TooltipManager";
import { Droppable } from 'react-beautiful-dnd';
import { ScrollArea } from "@/components/ui/scroll-area";
import TemplateSelectionModal from "../modals/TemplateSelectionModal";
import { DEFAULT_TEMPLATES } from "@/types/template-types";

interface WidgetBuilderPanelProps {
  widgetComponents: WidgetComponent[];
  apis: ApiConfig[];
  tooltips: Tooltip[];
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onReorderComponents: (reorderedComponents: WidgetComponent[]) => void;
  onRequestApiTemplate: (componentId: string) => void;
  onApplyTooltip: (componentId: string, tooltipId: string) => void;
  onNewWidget: () => void;
  onLoadWidget: () => void;
}

const WidgetBuilderPanel: React.FC<WidgetBuilderPanelProps> = ({
  widgetComponents,
  apis,
  tooltips,
  onUpdateComponent,
  onRemoveComponent,
  onReorderComponents,
  onRequestApiTemplate,
  onApplyTooltip,
  onNewWidget,
  onLoadWidget
}) => {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isFromTemplate, setIsFromTemplate] = useState(false);

  const handleSelectTemplate = (template: typeof DEFAULT_TEMPLATES[0]) => {
    // Reset components with template components
    template.components.forEach((component) => {
      // Add visible property to each component
      const componentWithVisibility = {
        ...component,
        visible: true
      };
      onUpdateComponent(componentWithVisibility);
    });
    setIsFromTemplate(true);
  };

  const handleComponentVisibility = (componentId: string, visible: boolean) => {
    const component = widgetComponents.find(c => c.id === componentId);
    if (component) {
      onUpdateComponent({
        ...component,
        visible: visible
      });
    }
  };

  return (
    <div className="w-2/5 bg-widget-gray flex flex-col h-full">
      <div className="sticky top-0 z-40 bg-widget-gray p-4 border-b border-gray-200">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Widget Builder</h2>
          <div className="space-x-2">
            <DropdownMenu>
              <Button
                asChild
                variant="default"
                size="default"
                className="bg-widget-blue hover:bg-blue-600 transition-colors"
              >
                <DropdownMenuTrigger>
                  <Plus size={16} className="mr-2" /> Add New Widget
                  <ChevronDown size={16} className="ml-2" />
                </DropdownMenuTrigger>
              </Button>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsTemplateModalOpen(true)}>
                  <Library size={16} className="mr-2" /> 
                  Use Template
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onNewWidget}>
                  <Plus size={16} className="mr-2" /> 
                  Create Blank Widget
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="px-4 pb-4 h-full">
          <Droppable droppableId="widget-builder">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="h-full"
              >
                <WidgetBuilder
                  components={widgetComponents}
                  apis={apis}
                  onUpdateComponent={onUpdateComponent}
                  onRemoveComponent={(componentId) => {
                    if (!isFromTemplate) {
                      onRemoveComponent(componentId);
                    }
                  }}
                  onReorderComponents={onReorderComponents}
                  onRequestApiTemplate={onRequestApiTemplate}
                  onApplyTooltip={onApplyTooltip}
                  tooltips={tooltips}
                  isTemplate={isFromTemplate}
                  onToggleVisibility={handleComponentVisibility}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </ScrollArea>

      <TemplateSelectionModal
        isOpen={isTemplateModalOpen}
        onOpenChange={setIsTemplateModalOpen}
        onSelectTemplate={handleSelectTemplate}
        templates={DEFAULT_TEMPLATES}
      />
    </div>
  );
};

export default WidgetBuilderPanel;
