
import { LucideIcon } from 'lucide-react';

export type ComponentType = 'header' | 'text' | 'image' | 'button' | 'video' | 'chart' | 'form' | 'calendar' | 'dropdown' | 'link' | 'multi-text' | 'filter' | 'alert' | 'table';

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
    type: 'text' | 'number' | 'select' | 'color' | 'icon' | 'font';
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

export type CalendarServiceType = 'google' | 'outlook' | 'apple' | 'custom';

export interface CalendarIntegrationConfig {
  serviceType: CalendarServiceType;
  apiKey?: string;
  calendarId?: string;
  syncEnabled: boolean;
}

export interface ICSConfig {
  enabled: boolean;
  importEnabled?: boolean;
  exportEnabled?: boolean;
  allowSubscribe?: boolean;
  icsUrl?: string;
  syncInterval?: 'hourly' | 'daily' | 'weekly' | 'never';
}

export interface ColorPalette {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
}

export type FontFamily = 
  'Arial' | 
  'Helvetica' | 
  'Times New Roman' | 
  'Georgia' | 
  'Courier New' | 
  'Verdana' | 
  'Tahoma' | 
  'Trebuchet MS' | 
  'Impact' | 
  'Comic Sans MS' | 
  'Roboto' | 
  'Open Sans' | 
  'Lato' | 
  'Montserrat' | 
  'Poppins' | 
  'Playfair Display' | 
  'Merriweather' | 
  'system-ui';

export const PREDEFINED_COLORS = [
  "#FFFFFF", "#F8FAFC", "#F1F5F9", "#E2E8F0", "#CBD5E1",
  "#94A3B8", "#64748B", "#475569", "#334155", "#1E293B",
  "#0F172A", "#000000", "#EF4444", "#F97316", "#F59E0B",
  "#EAB308", "#84CC16", "#22C55E", "#10B981", "#14B8A6",
  "#06B6D4", "#0EA5E9", "#3B82F6", "#6366F1", "#8B5CF6",
  "#A855F7", "#D946EF", "#EC4899", "#F43F5E", "transparent"
];

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface TableColumn {
  header: string;
  accessor: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'icon';
}
