
// Adding the missing type definitions for WidgetComponent
declare module "@/types/widget-types" {
  import { WidgetComponent as BaseWidgetComponent } from "@/types/component-types";
  
  // Re-export the component interface with all its properties
  export interface WidgetComponent extends BaseWidgetComponent {}
}
