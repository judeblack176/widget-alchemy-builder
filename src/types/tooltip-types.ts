
export interface Tooltip {
  id: string;
  title: string;
  content: string;
  type?: 'info' | 'warning' | 'success' | 'error';
  tags?: string[];
}

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
