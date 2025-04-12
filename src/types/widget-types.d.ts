
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

export interface ApiFieldMapping {
  label: string;
  apiField: string;
}

export interface ComponentDefinition {
  type: ComponentType;
  name: string;
  icon: string;
  defaultProps: Record<string, any>;
  availableProps: Array<{
    name: string;
    type: string;
    label: string;
    options?: string[];
  }>;
  supportsApiIntegration?: boolean;
  defaultDataMapping?: Record<string, string>;
}

// Define PREDEFINED_COLORS
export const PREDEFINED_COLORS = [
  "#FFFFFF", "#F8FAFC", "#F1F5F9", "#E2E8F0", "#CBD5E1",
  "#94A3B8", "#64748B", "#475569", "#334155", "#1E293B",
  "#0F172A", "#000000", "#EF4444", "#F97316", "#F59E0B",
  "#EAB308", "#84CC16", "#22C55E", "#10B981", "#14B8A6",
  "#06B6D4", "#0EA5E9", "#3B82F6", "#6366F1", "#8B5CF6",
  "#A855F7", "#D946EF", "#EC4899", "#F43F5E", "transparent"
];

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
