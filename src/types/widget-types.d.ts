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

export type ComponentType =
  | "header"
  | "text"
  | "image"
  | "button"
  | "video"
  | "chart"
  | "form"
  | "calendar"
  | "dropdown"
  | "link"
  | "multi-text"
  | "filter"
  | "alert"
  | "table";

export type AlertType = "info" | "success" | "warning" | "error";

export interface TableColumn {
  header: string;
  accessor: string;
}

export interface ApiConfig {
  id: string;
  name: string;
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  bodyType?: 'JSON' | 'Raw';
  rawBody?: string;
  sampleResponse?: string;
  possibleFields?: string[];
}

export interface WidgetSubmission {
  id: string;
  name: string;
  description: string;
  config: {
    components: WidgetComponent[];
    apis: ApiConfig[];
  };
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

// Update the WidgetComponent interface to include tooltipId
export interface WidgetComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  apiConfig?: {
    apiId: string;
    dataMapping: Record<string, string>;
  };
  tooltipId?: string;
}
