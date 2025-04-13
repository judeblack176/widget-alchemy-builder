
import { LucideIcon } from 'lucide-react';

export type ComponentType = 'header' | 'text' | 'image' | 'button' | 'video' | 'chart' | 'form' | 'calendar' | 'dropdown' | 'link' | 'multi-text' | 'filter' | 'alert' | 'table' | 'searchbar';

export interface ContentField {
  label: string;
  apiField: string;
  mapping?: string;
}

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
  formattedContent?: string;
  contentFields?: ContentField[];
}

export interface ComponentDefinition {
  type: ComponentType;
  name: string;
  icon: string;
  defaultProps: Record<string, any>;
  availableProps: Array<{
    name: string;
    type: 'text' | 'number' | 'select' | 'color' | 'icon' | 'font';
    label: string;
    options?: string[];
  }>;
  supportsApiIntegration?: boolean;
  defaultDataMapping?: Record<string, string>;
}

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface TableColumn {
  header: string;
  accessor: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'icon';
}

// Default data mapping configurations for each component type
export const DEFAULT_DATA_MAPPINGS: Record<ComponentType, Record<string, string>> = {
  header: {
    title: "title",
    subtitle: "subtitle"
  },
  text: {
    content: "content"
  },
  image: {},
  button: {
    label: "label",
    url: "url"
  },
  video: {
    source: "videoUrl",
    title: "title",
    description: "description"
  },
  chart: {
    data: "data",
    labels: "labels",
    title: "title",
    dataUrl: "dataUrl"
  },
  form: {
    label: "label",
    placeholder: "placeholder",
    options: "options"
  },
  calendar: {
    events: "events",
    title: "title"
  },
  dropdown: {
    options: "options",
    label: "label",
    placeholder: "placeholder"
  },
  link: {
    text: "text",
    url: "url"
  },
  "multi-text": {
    content: "content",
    label: "label",
    placeholder: "placeholder"
  },
  filter: {
    options: "options",
    label: "label",
    placeholder: "placeholder"
  },
  alert: {
    title: "title",
    type: "type",
    formattedContent: "content"
  },
  table: {
    data: "rows",
    columns: "columns"
  },
  searchbar: {
    placeholder: "placeholder",
    label: "label"
  }
};
