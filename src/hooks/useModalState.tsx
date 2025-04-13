
import { useState } from "react";
import { ApiConfig } from "@/types/widget-types";

export const useModalState = () => {
  const [activeTab, setActiveTab] = useState<string>("components");
  const [isApiTemplateModalOpen, setIsApiTemplateModalOpen] = useState(false);
  const [isTooltipListModalOpen, setIsTooltipListModalOpen] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  const openApiTemplateModal = (componentId: string) => {
    setSelectedComponentId(componentId);
    setIsApiTemplateModalOpen(true);
  };

  return {
    activeTab,
    setActiveTab,
    isApiTemplateModalOpen,
    setIsApiTemplateModalOpen,
    isTooltipListModalOpen,
    setIsTooltipListModalOpen,
    selectedComponentId,
    setSelectedComponentId,
    openApiTemplateModal
  };
};
