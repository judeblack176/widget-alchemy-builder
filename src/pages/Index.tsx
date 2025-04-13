
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DragDropContext } from 'react-beautiful-dnd';
import { useWidgetState } from "@/hooks/useWidgetState";
import { useModalState } from "@/hooks/useModalState";
import { useToast } from "@/hooks/use-toast";
import WidgetBuilderHeader from "@/components/widget-builder/page-components/WidgetBuilderHeader";
import ComponentLibraryPanel from "@/components/widget-builder/page-components/ComponentLibraryPanel";
import WidgetBuilderPanel from "@/components/widget-builder/page-components/WidgetBuilderPanel";
import WidgetPreviewPanel from "@/components/widget-builder/page-components/WidgetPreviewPanel";
import ApiTemplateModal from "@/components/widget-builder/modals/ApiTemplateModal";
import TooltipListModal from "@/components/widget-builder/modals/TooltipListModal";
import ApiTemplateHandler from "@/components/widget-builder/page-components/ApiTemplateHandler";

const Index = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const widgetId = queryParams.get('widgetId');
  
  // Use our custom hooks for state management
  const {
    widgetComponents,
    apis,
    tooltips,
    isEditing,
    savedApiTemplates,
    handleAddComponent,
    handleUpdateComponent,
    handleRemoveComponent,
    handleReorderComponents,
    handleAddApi,
    handleUpdateApi,
    handleRemoveApi,
    handleAddTooltip,
    handleUpdateTooltip,
    handleRemoveTooltip,
    handleApplyTooltip,
    setIsEditing
  } = useWidgetState(widgetId);
  
  const {
    activeTab,
    setActiveTab,
    isApiTemplateModalOpen,
    setIsApiTemplateModalOpen,
    isTooltipListModalOpen,
    setIsTooltipListModalOpen,
    selectedComponentId,
    openApiTemplateModal
  } = useModalState();

  // Widget action handlers
  const handleSaveWidget = () => {
    const widgetConfig = {
      components: widgetComponents,
      apis: apis,
      tooltips: tooltips
    };
    
    localStorage.setItem('savedWidget', JSON.stringify(widgetConfig));
    
    toast({
      title: "Widget Saved",
      description: "Your widget configuration has been saved."
    });
  };

  const handleLoadWidget = () => {
    navigate('/library?mode=select');
    setIsEditing(false);
  };

  const handleNewWidget = () => {
    setIsEditing(false);
    navigate('/');
    
    toast({
      title: "New Widget Started",
      description: "You can now start building a new widget from scratch."
    });
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    navigate('/');
    toast({
      title: "Editing Cancelled",
      description: "Changes to the widget have been discarded."
    });
  };

  const handleSubmitSuccess = () => {
    setIsEditing(false);
    toast({
      title: "Widget Submitted",
      description: "Your widget has been submitted to the library for approval",
    });
  };

  // API template handler
  const apiTemplateHandler = ApiTemplateHandler({
    widgetComponents,
    apis,
    selectedComponentId,
    onUpdateComponent: handleUpdateComponent,
    onAddApi: handleAddApi,
    setIsApiTemplateModalOpen
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    if (result.source.droppableId === 'component-library' && result.destination.droppableId === 'widget-builder') {
      const componentType = result.draggableId;
      const componentLibraryItem = document.querySelector(`[data-component-type="${componentType}"]`);
      
      if (componentLibraryItem && componentLibraryItem instanceof HTMLElement) {
        componentLibraryItem.click();
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen bg-gray-100">
        <WidgetBuilderHeader
          onLoadWidget={handleLoadWidget}
          onNewWidget={handleNewWidget}
        />
        
        <div className="flex flex-1 overflow-hidden">
          <ComponentLibraryPanel
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onAddComponent={handleAddComponent}
            widgetComponents={widgetComponents}
            apis={apis}
            tooltips={tooltips}
            onAddApi={handleAddApi}
            onRemoveApi={handleRemoveApi}
            onUpdateApi={handleUpdateApi}
            onAddTooltip={handleAddTooltip}
            onUpdateTooltip={handleUpdateTooltip}
            onRemoveTooltip={handleRemoveTooltip}
          />
          
          <WidgetBuilderPanel
            widgetComponents={widgetComponents}
            apis={apis}
            tooltips={tooltips}
            onUpdateComponent={handleUpdateComponent}
            onRemoveComponent={handleRemoveComponent}
            onReorderComponents={handleReorderComponents}
            onRequestApiTemplate={openApiTemplateModal}
            onApplyTooltip={handleApplyTooltip}
            onNewWidget={handleNewWidget}
            onLoadWidget={handleLoadWidget}
          />
          
          <WidgetPreviewPanel
            widgetComponents={widgetComponents}
            apis={apis}
            isEditing={isEditing}
            widgetId={widgetId}
            onSaveWidget={handleSaveWidget}
            onCancelEditing={handleCancelEditing}
            onSubmitSuccess={handleSubmitSuccess}
          />
        </div>
        
        <ApiTemplateModal
          isOpen={isApiTemplateModalOpen}
          onOpenChange={setIsApiTemplateModalOpen}
          apiTemplates={savedApiTemplates}
          onApplyTemplate={apiTemplateHandler.applyApiTemplateToComponent}
        />

        <TooltipListModal
          isOpen={isTooltipListModalOpen}
          onOpenChange={setIsTooltipListModalOpen}
          tooltips={tooltips}
        />
      </div>
    </DragDropContext>
  );
};

export default Index;
