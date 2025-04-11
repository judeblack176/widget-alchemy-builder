
import { WidgetComponent, ApiConfig } from "./widget-types";

declare module "@/components/widget-builder/WidgetBuilder" {
  export interface WidgetBuilderProps {
    components: WidgetComponent[];
    apis: ApiConfig[];
    onUpdateComponent: (updatedComponent: WidgetComponent) => void;
    onRemoveComponent: (componentId: string) => void;
    onReorderComponents: (reorderedComponents: WidgetComponent[]) => void;
    onRequestApiTemplate: (componentId: string) => void;
    onApplyTooltip: (componentId: string, tooltipId: string) => void;
  }
}

export interface Tooltip {
  id: string;
  title: string;
  content: string;
  type?: "info" | "warning" | "success" | "error";
  createdAt: string;
}
