
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
      return [
        { name: 'content', type: 'text', label: 'Content' },
        { name: 'size', type: 'select', label: 'Text Size', 
          options: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'] },
        { name: 'color', type: 'color', label: 'Text Color' },
        { name: 'bold', type: 'select', label: 'Bold Text', 
          options: ['true', 'false'] },
        { name: 'italic', type: 'select', label: 'Italic Text', 
          options: ['true', 'false'] },
        { name: 'alignment', type: 'select', label: 'Text Alignment', 
          options: ['left', 'center', 'right', 'justify'] },
        { name: 'fontFamily', type: 'select', label: 'Font Family', 
          options: ['system-ui', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New', 'Verdana'] }
      ];
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
        { name: 'url', type: 'text', label: 'URL (if link)' }
      ];
    case 'alert':
      return [
        { name: 'title', type: 'text', label: 'Alert Title' },
        { name: 'type', type: 'select', label: 'Alert Type', 
          options: ['info', 'success', 'warning', 'error'] },
        // Removed 'content' property as we'll use formattedContent instead
        { name: 'dismissible', type: 'select', label: 'Dismissible', 
          options: ['true', 'false'] },
        { name: 'autoClose', type: 'select', label: 'Auto Close (seconds)', 
          options: ['0', '3', '5', '10'] }
      ];
    default:
      return [];
  }
};
