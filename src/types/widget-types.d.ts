
// Adding the missing type definitions for WidgetComponent
declare module "@/types/widget-types" {
  export interface ContentField {
    label: string;
    apiField: string;
  }

  export interface WidgetComponent {
    id: string;
    type: ComponentType;
    props: Record<string, any>;
    apiConfig?: {
      apiId: string;
      dataMapping?: Record<string, string>;
      multiMapping?: Record<string, string[]>;
    };
    tooltipId?: string;
    formattedContent?: string;
    contentFields?: ContentField[];
  }
}
