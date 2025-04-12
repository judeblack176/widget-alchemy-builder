
import { LucideIcon } from 'lucide-react';

export type ComponentType = 'header' | 'text' | 'image' | 'button' | 'video' | 'chart' | 'form' | 'calendar' | 'dropdown' | 'link' | 'multi-text' | 'filter' | 'alert' | 'table' | 'searchbar';

export interface ContentFieldConfig {
  field?: string;
  customText?: string;
  fontFamily?: string;
  fontSize?: string;
  alignment?: "left" | "center" | "right";
}

export interface WidgetComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  apiConfig?: {
    apiId: string;
    dataMapping: Record<string, string>;
    multiMapping?: Record<string, string[]>;
    contentConfig?: Record<string, ContentFieldConfig>;
  };
  tooltipId?: string;
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

export interface ApiConfig {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  parameters?: Record<string, string>;
  responseMapping?: Record<string, string>;
  sampleResponse?: string;
  possibleFields?: string[];
}

export interface WidgetConfig {
  components: WidgetComponent[];
  apis: ApiConfig[];
}

export type CalendarServiceType = 'google' | 'outlook' | 'apple' | 'custom' | 'none';

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

export const COLOR_PALETTE = {
  neutrals: [
    "#FFFFFF", // White
    "#F8FAFC", // Lightest Gray
    "#F1F5F9", // Lighter Gray
    "#E2E8F0", // Light Gray
    "#CBD5E1", // Gray
    "#94A3B8", // Medium Gray
    "#64748B", // Dark Gray
    "#475569", // Darker Gray
    "#334155", // Very Dark Gray
    "#1E293B", // Almost Black
    "#0F172A", // Deep Black
    "#000000"  // Black
  ],
  reds: [
    "#FEF2F2", // Lightest Red
    "#FEE2E2", // Lighter Red
    "#FECACA", // Light Red
    "#FCA5A5", // Red
    "#F87171", // Medium Red
    "#EF4444", // Standard Red
    "#DC2626", // Dark Red
    "#B91C1C", // Darker Red
    "#991B1B", // Very Dark Red
    "#7F1D1D"  // Deep Red
  ],
  oranges: [
    "#FFF7ED", // Lightest Orange
    "#FFEDD5", // Lighter Orange
    "#FED7AA", // Light Orange
    "#FDBA74", // Orange
    "#FB923C", // Medium Orange
    "#F97316", // Standard Orange
    "#EA580C", // Dark Orange
    "#C2410C", // Darker Orange
    "#9A3412", // Very Dark Orange
    "#7C2D12"  // Deep Orange
  ],
  yellows: [
    "#FEFCE8", // Lightest Yellow
    "#FEF9C3", // Lighter Yellow
    "#FEF08A", // Light Yellow
    "#FDE047", // Yellow
    "#FACC15", // Medium Yellow
    "#EAB308", // Standard Yellow
    "#CA8A04", // Dark Yellow
    "#A16207", // Darker Yellow
    "#854D0E", // Very Dark Yellow
    "#713F12"  // Deep Yellow
  ],
  greens: [
    "#F0FDF4", // Lightest Green
    "#DCFCE7", // Lighter Green
    "#BBF7D0", // Light Green
    "#86EFAC", // Green
    "#4ADE80", // Medium Green
    "#22C55E", // Standard Green
    "#16A34A", // Dark Green
    "#15803D", // Darker Green
    "#166534", // Very Dark Green
    "#14532D"  // Deep Green
  ],
  blues: [
    "#EFF6FF", // Lightest Blue
    "#DBEAFE", // Lighter Blue
    "#BFDBFE", // Light Blue
    "#93C5FD", // Blue
    "#60A5FA", // Medium Blue
    "#3B82F6", // Standard Blue
    "#2563EB", // Dark Blue
    "#1D4ED8", // Darker Blue
    "#1E40AF", // Very Dark Blue
    "#1E3A8A"  // Deep Blue
  ],
  purples: [
    "#F5F3FF", // Lightest Purple
    "#EDE9FE", // Lighter Purple
    "#DDD6FE", // Light Purple
    "#C4B5FD", // Purple
    "#A78BFA", // Medium Purple
    "#8B5CF6", // Standard Purple
    "#7C3AED", // Dark Purple
    "#6D28D9", // Darker Purple
    "#5B21B6", // Very Dark Purple
    "#4C1D95"  // Deep Purple
  ],
  pinks: [
    "#FDF2F8", // Lightest Pink
    "#FCE7F3", // Lighter Pink
    "#FBCFE8", // Light Pink
    "#F9A8D4", // Pink
    "#F472B6", // Medium Pink
    "#EC4899", // Standard Pink
    "#DB2777", // Dark Pink
    "#BE185D", // Darker Pink
    "#9D174D", // Very Dark Pink
    "#831843"  // Deep Pink
  ]
};

// Default data mapping configurations for each component type
export const DEFAULT_DATA_MAPPINGS: Record<ComponentType, Record<string, string>> = {
  header: {
    title: "title",
    subtitle: "subtitle"
  },
  text: {
    content: "content"
  },
  image: {
    source: "imageUrl",
    altText: "altText",
    caption: "caption"
  },
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
    title: "title"
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
    message: "message",
    type: "type"
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

export type WidgetApprovalStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface WidgetSubmission {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: WidgetApprovalStatus;
  feedback?: string;
  config: WidgetConfig;
  thumbnail?: string;
  author: string;
  category?: string;
  tags?: string[];
  version: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export const extractFieldPaths = (obj: any, prefix = ''): string[] => {
  if (!obj || typeof obj !== 'object') return [];
  
  let paths: string[] = [];
  
  Object.entries(obj).forEach(([key, value]) => {
    const newPath = prefix ? `${prefix}.${key}` : key;
    paths.push(newPath);
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // For nested objects, recurse deeper
      paths = [...paths, ...extractFieldPaths(value, newPath)];
    } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      // For arrays of objects, show array notation and recurse into the first item
      paths.push(`${newPath}[0]`);
      paths = [...paths, ...extractFieldPaths(value[0], `${newPath}[0]`)];
    }
  });
  
  return paths;
};

// Common predefined tooltip tags
export const COMMON_TOOLTIP_TAGS = [
  "Getting Started",
  "Advanced",
  "Interface",
  "Features", 
  "Tips",
  "Help",
  "Navigation",
  "Forms",
  "Charts",
  "Tables",
  "API",
  "Data",
  "Technical",
  "User Guide",
  "Best Practices"
];
