
interface PropertyDefinition {
  name: string;
  type: string;
  label: string;
  options?: string[];
}

export const getPropertyDefinitions = (componentType: string): PropertyDefinition[] => {
  switch (componentType) {
    case 'header':
      return [
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
          name: "bold",
          type: "select",
          label: "Bold Text",
          options: ["true", "false"]
        },
        {
          name: "italic",
          type: "select",
          label: "Italic Text",
          options: ["true", "false"]
        },
        {
          name: "fontFamily",
          type: "select",
          label: "Font Family",
          options: ["system-ui", "Arial", "Helvetica", "Times New Roman", "Georgia", "Courier New", "Verdana"]
        }
      ];
    case 'text':
      return [
        {
          name: "content",
          type: "text",
          label: "Content"
        },
        {
          name: "size",
          type: "select",
          label: "Text Size",
          options: ["xs", "sm", "base", "lg", "xl", "2xl", "3xl"]
        },
        {
          name: "color",
          type: "color",
          label: "Text Color"
        },
        {
          name: "bold",
          type: "select",
          label: "Bold Text",
          options: ["true", "false"]
        },
        {
          name: "italic",
          type: "select",
          label: "Italic Text",
          options: ["true", "false"]
        },
        {
          name: "alignment",
          type: "select",
          label: "Text Alignment",
          options: ["left", "center", "right", "justify"]
        },
        {
          name: "fontFamily",
          type: "select",
          label: "Font Family",
          options: ["system-ui", "Arial", "Helvetica", "Times New Roman", "Georgia", "Courier New", "Verdana"]
        }
      ];
    case 'image':
      return [
        {
          name: "source",
          type: "text",
          label: "Image URL"
        },
        {
          name: "altText",
          type: "text",
          label: "Alt Text"
        },
        {
          name: "caption",
          type: "text",
          label: "Caption"
        },
        {
          name: "width",
          type: "text",
          label: "Width"
        },
        {
          name: "height",
          type: "text",
          label: "Height"
        },
        {
          name: "fit",
          type: "select",
          label: "Image Fit",
          options: ["contain", "cover", "fill", "none"]
        }
      ];
    case 'button':
      return [
        {
          name: "label",
          type: "text",
          label: "Button Text"
        },
        {
          name: "icon",
          type: "icon",
          label: "Icon"
        },
        {
          name: "variant",
          type: "select",
          label: "Variant",
          options: ["default", "outline", "secondary", "ghost", "link"]
        },
        {
          name: "size",
          type: "select",
          label: "Size",
          options: ["sm", "default", "lg"]
        },
        {
          name: "url",
          type: "text",
          label: "URL (if link)"
        }
      ];
    case 'alert':
      return [
        {
          name: "title",
          type: "text",
          label: "Alert Title"
        },
        {
          name: "message",
          type: "text",
          label: "Alert Message"
        },
        {
          name: "type",
          type: "select",
          label: "Alert Type",
          options: ["info", "success", "warning", "error"]
        },
        {
          name: "dismissible",
          type: "select",
          label: "Dismissible",
          options: ["true", "false"]
        },
        {
          name: "autoClose",
          type: "select",
          label: "Auto Close (seconds)",
          options: ["false", "3", "5", "10"]
        }
      ];
    // Add cases for all other component types as needed
    default:
      return [];
  }
};
