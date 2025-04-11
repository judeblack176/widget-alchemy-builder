
import { LucideIcon } from 'lucide-react';

export type ComponentType = 'header' | 'text' | 'image' | 'button' | 'video' | 'chart' | 'form' | 'calendar' | 'dropdown' | 'link' | 'multi-text';

export interface WidgetComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  apiConfig?: {
    apiId: string;
    dataMapping: Record<string, string>;
  };
}

export interface ComponentDefinition {
  type: ComponentType;
  name: string;
  icon: string;
  defaultProps: Record<string, any>;
  availableProps: Array<{
    name: string;
    type: 'text' | 'number' | 'select' | 'color' | 'icon';
    label: string;
    options?: string[];
  }>;
}

export interface ApiConfig {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  parameters?: Record<string, string>;
  responseMapping?: Record<string, string>;
}

export interface WidgetConfig {
  components: WidgetComponent[];
  apis: ApiConfig[];
}
