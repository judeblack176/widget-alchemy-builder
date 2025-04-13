export const getPropertyDefinitions = (componentType: string) => {
  switch (componentType) {
    case 'header':
      return [
        { name: 'name', type: 'text', label: 'Header Name' },
        { name: 'title', type: 'text', label: 'Title' },
        { name: 'icon', type: 'icon', label: 'Icon' },
        { name: 'backgroundColor', type: 'color', label: 'Background Color' },
        { name: 'textColor', type: 'color', label: 'Text Color' },
        { name: 'fontFamily', type: 'select', label: 'Font Family', options: ['system-ui', 'Arial', 'Verdana', 'Helvetica', 'Times New Roman', 'Courier New'] },
        { name: 'bold', type: 'select', label: 'Bold', options: ['true', 'false'] },
        { name: 'italic', type: 'select', label: 'Italic', options: ['true', 'false'] },
      ];
    case 'text':
      return [
        { name: 'size', type: 'select', label: 'Size', options: ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl'] },
        { name: 'color', type: 'color', label: 'Color' },
        { name: 'bold', type: 'select', label: 'Bold', options: ['true', 'false'] },
        { name: 'italic', type: 'select', label: 'Italic', options: ['true', 'false'] },
      ];
    case 'image':
      return [
        { name: 'source', type: 'text', label: 'Source URL' },
        { name: 'altText', type: 'text', label: 'Alt Text' },
        { name: 'width', type: 'text', label: 'Width' },
        { name: 'height', type: 'text', label: 'Height' },
      ];
    case 'button':
      return [
        { name: 'label', type: 'text', label: 'Label' },
        { name: 'url', type: 'text', label: 'URL' },
        { name: 'backgroundColor', type: 'color', label: 'Background Color' },
        { name: 'textColor', type: 'color', label: 'Text Color' },
      ];
    case 'video':
      return [
        { name: 'source', type: 'text', label: 'Source URL' },
        { name: 'width', type: 'text', label: 'Width' },
        { name: 'height', type: 'text', label: 'Height' },
      ];
    case 'chart':
      return [
        { name: 'type', type: 'select', label: 'Chart Type', options: ['bar', 'line', 'pie', 'doughnut'] },
        { name: 'labels', type: 'text', label: 'Labels (comma separated)' },
        { name: 'data', type: 'text', label: 'Data (comma separated)' },
        { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      ];
    case 'form':
      return [
        { name: 'label', type: 'text', label: 'Label' },
        { name: 'placeholder', type: 'text', label: 'Placeholder' },
        { name: 'options', type: 'text', label: 'Options (comma separated)' },
      ];
    case 'calendar':
      return [
        { name: 'events', type: 'text', label: 'Events (JSON format)' },
      ];
    case 'dropdown':
      return [
        { name: 'label', type: 'text', label: 'Label' },
        { name: 'options', type: 'text', label: 'Options (comma separated)' },
      ];
    case 'link':
      return [
        { name: 'text', type: 'text', label: 'Text' },
        { name: 'url', type: 'text', label: 'URL' },
      ];
    case 'multi-text':
      return [
        { name: 'label', type: 'text', label: 'Label' },
        { name: 'placeholder', type: 'text', label: 'Placeholder' },
      ];
    case 'filter':
      return [
        { name: 'label', type: 'text', label: 'Label' },
        { name: 'options', type: 'text', label: 'Options (comma separated)' },
      ];
    case 'alert':
      return [
        { name: 'title', type: 'text', label: 'Title' },
        { name: 'message', type: 'text', label: 'Message' },
      ];
    case 'table':
      return [
        { name: 'columns', type: 'text', label: 'Columns (JSON format)' },
        { name: 'rows', type: 'text', label: 'Rows (JSON format)' },
      ];
      case 'searchbar':
        return [
          { name: 'placeholder', type: 'text', label: 'Placeholder' },
          { name: 'label', type: 'text', label: 'Label' },
        ];
    default:
      return [];
  }
};
