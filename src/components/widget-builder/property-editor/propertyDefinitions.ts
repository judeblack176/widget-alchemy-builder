import { ComponentType } from '@/types/component-types';

export interface PropertyDefinition {
  name: string;
  type: 'text' | 'number' | 'select' | 'color' | 'icon' | 'font';
  label: string;
  options?: string[];
}

export const getPropertyDefinitions = (componentType: ComponentType): PropertyDefinition[] => {
  const definitions: Record<ComponentType, PropertyDefinition[]> = {
    header: [
      {
        name: "name",
        type: "text",
        label: "Header Name"
      },
      {
        name: "icon",
        type: "icon",
        label: "Icon"
      },
      {
        name: "backgroundColor",
        type: "color",
        label: "Background Color"
      },
      {
        name: "textColor",
        type: "color",
        label: "Text Color"
      },
      {
        name: "fontFamily",
        type: "font",
        label: "Font Family"
      },
      {
        name: "bold",
        type: "select",
        label: "Bold",
        options: ["true", "false"]
      },
      {
        name: "italic",
        type: "select",
        label: "Italic",
        options: ["true", "false"]
      }
    ],
    text: [
      {
        name: "size",
        type: "select",
        label: "Size",
        options: ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl"]
      },
      {
        name: "color",
        type: "color",
        label: "Color"
      },
      {
        name: "bold",
        type: "select",
        label: "Bold",
        options: ["true", "false"]
      },
      {
        name: "italic",
        type: "select",
        label: "Italic",
        options: ["true", "false"]
      }
    ],
    image: [
      {
        name: "altText",
        type: "text",
        label: "Alt Text"
      },
      {
        name: "caption",
        type: "text",
        label: "Caption"
      }
    ],
    button: [
      {
        name: "variant",
        type: "select",
        label: "Variant",
        options: ["default", "destructive", "outline", "secondary", "ghost", "link"]
      },
      {
        name: "size",
        type: "select",
        label: "Size",
        options: ["default", "sm", "lg", "icon"]
      },
      {
        name: "url",
        type: "text",
        label: "URL"
      }
    ],
    video: [
      {
        name: "title",
        type: "text",
        label: "Title"
      },
      {
        name: "description",
        type: "text",
        label: "Description"
      }
    ],
    chart: [
      {
        name: "title",
        type: "text",
        label: "Title"
      }
    ],
    form: [
      {
        name: "label",
        type: "text",
        label: "Label"
      },
      {
        name: "placeholder",
        type: "text",
        label: "Placeholder"
      },
      {
        name: "options",
        type: "text",
        label: "Options"
      }
    ],
    calendar: [
      {
        name: "title",
        type: "text",
        label: "Title"
      }
    ],
    dropdown: [
      {
        name: "label",
        type: "text",
        label: "Label"
      },
      {
        name: "placeholder",
        type: "text",
        label: "Placeholder"
      },
      {
        name: "options",
        type: "text",
        label: "Options"
      }
    ],
    link: [
      {
        name: "text",
        type: "text",
        label: "Text"
      },
      {
        name: "url",
        type: "text",
        label: "URL"
      }
    ],
    "multi-text": [
      {
        name: "label",
        type: "text",
        label: "Label"
      },
      {
        name: "placeholder",
        type: "text",
        label: "Placeholder"
      }
    ],
    filter: [
      {
        name: "label",
        type: "text",
        label: "Label"
      },
      {
        name: "placeholder",
        type: "text",
        label: "Placeholder"
      },
       {
        name: "options",
        type: "text",
        label: "Options"
      }
    ],
    alert: [
      {
        name: "type",
        type: "select",
        label: "Alert Type",
        options: ["info", "success", "warning", "error"]
      },
      {
        name: "title",
        type: "text",
        label: "Alert Title"
      },
      {
        name: "dismissible",
        type: "select",
        label: "Dismissible",
        options: ["true", "false"]
      },
      {
        name: "backgroundColor",
        type: "color",
        label: "Background Color"
      },
      {
        name: "textColor",
        type: "color",
        label: "Text Color"
      },
      {
        name: "borderColor",
        type: "color",
        label: "Border Color"
      }
    ],
    table: [
      {
        name: "columns",
        type: "text",
        label: "Columns"
      },
      {
        name: "rows",
        type: "text",
        label: "Rows"
      }
    ],
    searchbar: [
      {
        name: "label",
        type: "text",
        label: "Label"
      },
      {
        name: "placeholder",
        type: "text",
        label: "Placeholder"
      }
    ]
  };

  return definitions[componentType] || [];
};
