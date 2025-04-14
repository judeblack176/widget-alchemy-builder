
import { ComponentType } from "@/types/component-types";

export interface PropertyDefinition {
  name: string;
  type: 'text' | 'number' | 'select' | 'color' | 'icon' | 'font';
  label: string;
  options?: string[];
}

export const getPropertyDefinitions = (componentType: ComponentType): PropertyDefinition[] => {
  switch (componentType) {
    case 'header':
      return [
        { name: 'icon', type: 'icon', label: 'Header Icon' },
        { name: 'name', type: 'text', label: 'Header Name' },
        { name: 'backgroundColor', type: 'color', label: 'Background Color' },
        { name: 'textColor', type: 'color', label: 'Text Color' },
        { name: 'fontFamily', type: 'select', label: 'Font Family', 
          options: ['system-ui', 'Arial', 'Georgia', 'Verdana', 'Courier New'] },
        { name: 'bold', type: 'select', label: 'Bold', 
          options: ['true', 'false'] },
        { name: 'italic', type: 'select', label: 'Italic', 
          options: ['true', 'false'] }
      ];
    case 'text':
      return [];
    case 'image':
      return [
        { name: 'source', type: 'text', label: 'Image URL' },
        { name: 'altText', type: 'text', label: 'Alt Text' },
        { name: 'caption', type: 'text', label: 'Caption' },
        { name: 'width', type: 'text', label: 'Width' },
        { name: 'height', type: 'text', label: 'Height' },
        { name: 'fit', type: 'select', label: 'Image Fit', 
          options: ['contain', 'cover', 'fill', 'none'] }
      ];
    case 'button':
      return [
        { name: 'label', type: 'text', label: 'Button Text' },
        { name: 'icon', type: 'icon', label: 'Icon' },
        { name: 'variant', type: 'select', label: 'Variant', 
          options: ['default', 'outline', 'secondary', 'ghost', 'link'] },
        { name: 'size', type: 'select', label: 'Size', 
          options: ['sm', 'default', 'lg'] },
        { name: 'url', type: 'text', label: 'URL (if link)' },
        { name: 'alignment', type: 'select', label: 'Alignment', 
          options: ['left', 'center', 'right'] }
      ];
    case 'chart':
      return [
        { name: 'title', type: 'text', label: 'Chart Title' },
        { name: 'chartType', type: 'select', label: 'Chart Type', 
          options: ['bar', 'line', 'pie', 'area'] },
        { name: 'height', type: 'number', label: 'Height (px)' },
        { name: 'dataUrl', type: 'text', label: 'Data URL' },
        { name: 'staticData', type: 'text', label: 'Static Data' },
        { name: 'categoryKey', type: 'text', label: 'Category Field' },
        { name: 'dataKey', type: 'text', label: 'Value Field' },
        { name: 'xAxisLabel', type: 'text', label: 'X-Axis Label' },
        { name: 'yAxisLabel', type: 'text', label: 'Y-Axis Label' },
        { name: 'legend', type: 'select', label: 'Show Legend', 
          options: ['true', 'false'] },
        { name: 'legendPosition', type: 'select', label: 'Legend Position', 
          options: ['left', 'center', 'right'] },
        { name: 'labels', type: 'text', label: 'Legend Labels' },
        { name: 'colors', type: 'text', label: 'Chart Colors' },
        { name: 'backgroundColor', type: 'color', label: 'Background Color' }
      ];
    case 'alert':
      return [
        { name: 'title', type: 'text', label: 'Alert Title' },
        { name: 'type', type: 'select', label: 'Alert Type', 
          options: ['info', 'success', 'warning', 'error'] },
        { name: 'dismissible', type: 'select', label: 'Dismissible', 
          options: ['true', 'false'] },
        { name: 'autoClose', type: 'select', label: 'Auto Close (seconds)', 
          options: ['0', '3', '5', '10'] }
      ];
    default:
      return [];
  }
};
