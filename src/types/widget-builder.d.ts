
import { WidgetComponent, ApiConfig } from "./widget-types";
import { TooltipTemplate } from "@/components/widget-builder/TooltipManager";

// Extend the WidgetBuilder props interface to include onRequestTooltipTemplate
declare module "@/components/widget-builder/WidgetBuilder" {
  export interface WidgetBuilderProps {
    components: WidgetComponent[];
    apis: ApiConfig[];
    onUpdateComponent: (updatedComponent: WidgetComponent) => void;
    onRemoveComponent: (componentId: string) => void;
    onReorderComponents: (reorderedComponents: WidgetComponent[]) => void;
    onRequestApiTemplate: (componentId: string) => void;
    onRequestTooltipTemplate: (componentId: string) => void;
  }
}
