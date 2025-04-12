
import React from "react";
import { WidgetProvider } from "@/contexts/WidgetContext";
import Header from "@/components/widget-builder/layout/Header";
import LeftPanel from "@/components/widget-builder/layout/LeftPanel";
import MiddlePanel from "@/components/widget-builder/layout/MiddlePanel";
import RightPanel from "@/components/widget-builder/layout/RightPanel";
import DragDropHandler from "@/components/widget-builder/layout/DragDropHandler";
import ApiTemplateModal from "@/components/widget-builder/modals/ApiTemplateModal";
import TooltipListModal from "@/components/widget-builder/modals/TooltipListModal";

const Index = () => {
  return (
    <WidgetProvider>
      <DragDropHandler>
        <div className="flex flex-col h-screen bg-gray-100">
          <Header />
          
          <div className="flex flex-1 overflow-hidden">
            <LeftPanel />
            <MiddlePanel />
            <RightPanel />
          </div>
          
          <ApiTemplateModal />
          <TooltipListModal />
        </div>
      </DragDropHandler>
    </WidgetProvider>
  );
};

export default Index;
