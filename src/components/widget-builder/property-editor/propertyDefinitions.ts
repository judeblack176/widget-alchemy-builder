
export function getPropertyDefinitions(componentType: string) {
  switch (componentType) {
    case 'header':
      return [
        { name: "title", type: "text", label: "Title" },
        { name: "icon", type: "icon", label: "Icon" },
        { name: "backgroundColor", type: "color", label: "Background Color" },
        { name: "textColor", type: "color", label: "Text Color" },
        { name: "fontFamily", type: "select", label: "Font Family", options: [
          "system-ui", "Arial", "Helvetica", "Times New Roman", "Georgia"
        ] },
        { name: "bold", type: "select", label: "Bold", options: ["true", "false"] },
        { name: "italic", type: "select", label: "Italic", options: ["true", "false"] }
      ];
    case 'text':
      return [
        { name: "content", type: "text", label: "Content" },
        { name: "size", type: "select", label: "Size", options: ["small", "medium", "large"] },
        { name: "color", type: "color", label: "Text Color" },
        { name: "backgroundColor", type: "color", label: "Background Color" },
        { name: "bold", type: "select", label: "Bold", options: ["true", "false"] },
        { name: "italic", type: "select", label: "Italic", options: ["true", "false"] }
      ];
    case 'button':
      return [
        { name: "label", type: "text", label: "Label" },
        { name: "backgroundColor", type: "color", label: "Background Color" },
        { name: "textColor", type: "color", label: "Text Color" },
        { name: "variant", type: "select", label: "Style", options: ["default", "outline", "secondary"] },
        { name: "linkUrl", type: "text", label: "Link URL (Optional)" },
        { name: "openInNewTab", type: "select", label: "Open in New Tab", options: ["true", "false"] }
      ];
    case 'image':
      return [
        { name: "source", type: "text", label: "Image URL" },
        { name: "altText", type: "text", label: "Alt Text" },
        { name: "caption", type: "text", label: "Caption" },
        { name: "width", type: "select", label: "Width", options: ["auto", "25%", "50%", "75%", "100%"] },
        { name: "height", type: "select", label: "Height", options: ["auto", "small", "medium", "large"] },
        { name: "borderRadius", type: "select", label: "Border Radius", options: ["none", "small", "medium", "large", "circle"] },
        { name: "objectFit", type: "select", label: "Object Fit", options: ["contain", "cover", "fill", "none"] }
      ];
    case 'alert':
      return [
        { name: "title", type: "text", label: "Title" },
        { name: "message", type: "text", label: "Message" },
        { name: "type", type: "select", label: "Alert Type", options: ["info", "success", "warning", "error"] },
        { name: "backgroundColor", type: "color", label: "Background Color" },
        { name: "textColor", type: "color", label: "Text Color" },
        { name: "borderColor", type: "color", label: "Border Color" },
        { name: "dismissible", type: "select", label: "Dismissible", options: ["true", "false"] },
        { name: "autoClose", type: "select", label: "Auto Close", options: ["false", "3000", "5000", "10000"] },
        { name: "notificationType", type: "select", label: "Notification Type", options: ["inline", "toast"] }
      ];
    case 'calendar':
      return [
        { name: "label", type: "text", label: "Label" },
        { name: "placeholder", type: "text", label: "Placeholder" },
        { name: "calendarType", type: "select", label: "Calendar Type", options: ["date-picker", "event-calendar"] },
        { name: "calendarProvider", type: "select", label: "Calendar Provider", options: ["none", "google", "microsoft", "apple", "custom"] },
        { name: "apiKey", type: "text", label: "API Key (if using provider)" },
        { name: "calendarId", type: "text", label: "Calendar ID (if using provider)" },
        { name: "showControls", type: "select", label: "Show Controls", options: ["true", "false"] },
        { name: "allowEditing", type: "select", label: "Allow Editing", options: ["true", "false"] },
        { name: "startDate", type: "text", label: "Start Date (YYYY-MM-DD)" },
        { name: "endDate", type: "text", label: "End Date (YYYY-MM-DD)" }
      ];
    case 'chart':
      return [
        { name: "chartType", type: "select", label: "Chart Type", options: ["bar", "line", "pie", "doughnut", "area", "radar"] },
        { name: "title", type: "text", label: "Chart Title" },
        { name: "dataSource", type: "select", label: "Data Source", options: ["static", "api", "url"] },
        { name: "dataUrl", type: "text", label: "Data URL (if using URL)" },
        { name: "staticData", type: "text", label: "Static Data (comma-separated)" },
        { name: "labels", type: "text", label: "Labels (comma-separated)" },
        { name: "legend", type: "select", label: "Show Legend", options: ["true", "false"] },
        { name: "legendPosition", type: "select", label: "Legend Position", options: ["top", "bottom", "left", "right"] },
        { name: "colors", type: "text", label: "Colors (comma-separated hex values)" },
        { name: "height", type: "text", label: "Chart Height (px)" }
      ];
    case 'dropdown':
      return [
        { name: "label", type: "text", label: "Label" },
        { name: "placeholder", type: "text", label: "Placeholder" },
        { name: "options", type: "text", label: "Options (comma separated)" },
        { name: "multiple", type: "select", label: "Allow Multiple Selection", options: ["true", "false"] },
        { name: "searchable", type: "select", label: "Searchable", options: ["true", "false"] },
        { name: "required", type: "select", label: "Required", options: ["true", "false"] },
        { name: "dynamicOptions", type: "select", label: "Dynamic Options", options: ["true", "false"] },
        { name: "optionsUrl", type: "text", label: "Options URL (if using dynamic)" },
        { name: "defaultValue", type: "text", label: "Default Value" }
      ];
    case 'link':
      return [
        { name: "text", type: "text", label: "Link Text" },
        { name: "url", type: "text", label: "URL" },
        { name: "openInNewTab", type: "select", label: "Open in New Tab", options: ["true", "false"] },
        { name: "style", type: "select", label: "Style", options: ["default", "button", "underlined"] },
        { name: "displayType", type: "select", label: "Display Type", options: ["text", "icon", "both"] },
        { name: "icon", type: "select", label: "Icon (if using icon)", options: ["LinkIcon", "ExternalLink", "FileText", "Download", "Info"] },
        { name: "color", type: "color", label: "Text Color" },
        { name: "backgroundColor", type: "color", label: "Background Color (for button style)" }
      ];
    case 'table':
      return [
        { name: "dataSource", type: "select", label: "Data Source", options: ["static", "api", "url"] },
        { name: "staticData", type: "text", label: "Static Data (JSON string)" },
        { name: "dataUrl", type: "text", label: "Data URL (if using URL)" },
        { name: "columns", type: "text", label: "Columns (JSON string)" },
        { name: "striped", type: "select", label: "Striped Rows", options: ["true", "false"] },
        { name: "hoverable", type: "select", label: "Hoverable Rows", options: ["true", "false"] },
        { name: "bordered", type: "select", label: "Bordered", options: ["true", "false"] },
        { name: "pagination", type: "select", label: "Pagination", options: ["true", "false"] },
        { name: "pageSize", type: "select", label: "Items Per Page", options: ["5", "10", "20", "50", "100"] },
        { name: "searchable", type: "select", label: "Searchable", options: ["true", "false"] },
        { name: "sortable", type: "select", label: "Sortable", options: ["true", "false"] },
        { name: "exportable", type: "select", label: "Exportable", options: ["true", "false"] },
        { name: "exportFormats", type: "select", label: "Export Formats", options: ["csv", "excel", "pdf", "all"] },
        { name: "headerBackgroundColor", type: "color", label: "Header Background Color" },
        { name: "headerTextColor", type: "color", label: "Header Text Color" }
      ];
    case 'searchbar':
      return [
        { name: "placeholder", type: "text", label: "Placeholder" },
        { name: "searchTarget", type: "select", label: "Search Target", options: ["widget", "external", "api"] },
        { name: "targetComponent", type: "text", label: "Target Component ID (if searching widget)" },
        { name: "searchApiUrl", type: "text", label: "Search API URL (if using API)" },
        { name: "searchField", type: "text", label: "Search Field (if searching widget)" },
        { name: "debounceTime", type: "select", label: "Debounce Time (ms)", options: ["0", "300", "500", "1000"] },
        { name: "minChars", type: "select", label: "Min Characters", options: ["1", "2", "3", "4"] },
        { name: "backgroundColor", type: "color", label: "Background Color" },
        { name: "textColor", type: "color", label: "Text Color" },
        { name: "borderColor", type: "color", label: "Border Color" },
        { name: "width", type: "select", label: "Width", options: ["full", "medium", "small"] },
        { name: "showIcon", type: "select", label: "Show Icon", options: ["true", "false"] }
      ];
    default:
      return [
        { name: "title", type: "text", label: "Title" },
        { name: "content", type: "text", label: "Content" },
        { name: "color", type: "color", label: "Color" }
      ];
  }
}
