
import { WidgetComponent, ApiConfig, Tooltip } from "@/types";

export interface WidgetContextType {
  widgetComponents: WidgetComponent[];
  apis: ApiConfig[];
  tooltips: Tooltip[];
  selectedComponentId: string | null;
  isEditing: boolean;
  isApiTemplateModalOpen: boolean;
  isTooltipListModalOpen: boolean;
  savedApiTemplates: ApiConfig[];
  setWidgetComponents: React.Dispatch<React.SetStateAction<WidgetComponent[]>>;
  setApis: React.Dispatch<React.SetStateAction<ApiConfig[]>>;
  setTooltips: React.Dispatch<React.SetStateAction<Tooltip[]>>;
  setSelectedComponentId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsApiTemplateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTooltipListModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSavedApiTemplates: React.Dispatch<React.SetStateAction<ApiConfig[]>>;
  handleAddComponent: (component: WidgetComponent | string) => void;
  handleUpdateComponent: (updatedComponent: WidgetComponent) => void;
  handleRemoveComponent: (componentId: string) => void;
  handleReorderComponents: (reorderedComponents: WidgetComponent[]) => void;
  handleAddApi: (api: ApiConfig) => void;
  handleUpdateApi: (apiId: string, updatedApi: ApiConfig) => void;
  handleRemoveApi: (apiId: string) => void;
  handleAddTooltip: (tooltip: Tooltip) => void;
  handleUpdateTooltip: (tooltipId: string, updatedTooltip: Tooltip) => void;
  handleRemoveTooltip: (tooltipId: string) => void;
  handleApplyTooltip: (componentId: string, tooltipId: string) => void;
  openApiTemplateModal: (componentId: string) => void;
  applyApiTemplateToComponent: (template: ApiConfig) => void;
}
