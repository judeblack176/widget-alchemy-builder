
// Color utilities for formatting toolbars

// Colors for the color picker
export const formattingColors = [
  "#000000", // Black
  "#FFFFFF", // White
  "#3b82f6", // Primary (Blue)
  "#6b7280", // Secondary (Gray)
  "#9ca3af", // Muted
  "#8b5cf6", // Accent (Purple)
  "#ef4444", // Red
  "#10b981", // Green
  "#f59e0b", // Yellow
  "#ec4899", // Pink
  "#f97316"  // Orange
];

// Map color to named color for class name
export const getColorName = (colorHex: string) => {
  const colorMap: Record<string, string> = {
    "#000000": "black",
    "#FFFFFF": "white",
    "#3b82f6": "primary",
    "#6b7280": "secondary",
    "#9ca3af": "muted",
    "#8b5cf6": "accent",
    "#ef4444": "red",
    "#10b981": "green",
    "#f59e0b": "yellow",
    "#ec4899": "pink",
    "#f97316": "orange"
  };
  
  return colorMap[colorHex] || colorHex.replace('#', '');
};
