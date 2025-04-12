
import { LucideIcon } from 'lucide-react';

export type ComponentType = 'header' | 'text' | 'image' | 'button' | 'video' | 'chart' | 'form' | 'calendar' | 'dropdown' | 'link' | 'multi-text' | 'filter' | 'alert' | 'table' | 'searchbar';

export interface WidgetComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  apiConfig?: {
    apiId: string;
    dataMapping: Record<string, string>;
    multiMapping?: Record<string, string[]>;
  };
  tooltipId?: string;
  selected?: boolean;
  contentFields?: Array<{
    label: string;
    apiField: string;
  }>;
  formattedContent?: string;
}

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface TableColumn {
  header: string;
  accessor: string;
}

export interface ContentDetails {
  size?: string;
  color?: string;
  variant?: string;
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
  parameters?: Record<string, string>;
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

export interface Tooltip {
  id: string;
  title: string;
  content: string;
  type?: 'info' | 'warning' | 'success' | 'error';
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

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
