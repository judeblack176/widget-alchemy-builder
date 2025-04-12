
import { WidgetComponent, ApiConfig, Tooltip } from "./widget-types";

declare module "@/components/widget-builder/WidgetBuilder" {
  export interface WidgetBuilderProps {
    initialComponents?: WidgetComponent[];
    initialApis?: ApiConfig[]; 
  }
}

declare module "@/components/widget-builder/ComponentLibrary" {
  export interface ComponentLibraryProps {
    onAddComponent: (component: ComponentType) => void;
    onAddMultipleComponents: (components: ComponentType[]) => void;
    existingComponents?: WidgetComponent[];
  }
}

declare module "@/components/widget-builder/ApiManager" {
  export interface ApiManagerProps {
    apis: ApiConfig[];
    onAddApi: (api: ApiConfig) => void;
    onUpdateApi: (id: string, api: ApiConfig) => void;
    onRemoveApi: (id: string) => void;
  }
}

declare module "@/components/widget-builder/TooltipManager" {
  export interface TooltipManagerProps {
    tooltips: Tooltip[];
    onAddTooltip: (tooltip: Tooltip) => void;
    onUpdateTooltip: (id: string, tooltip: Tooltip) => void;
    onRemoveTooltip: (id: string) => void;
  }
}
