
import { useLocation, useNavigate } from "react-router-dom";
import { DragDropContext } from 'react-beautiful-dnd';
import { useWidgetState } from "@/hooks/useWidgetState";
import { useModalState } from "@/hooks/useModalState";
import WidgetBuilderHeader from "@/components/widget-builder/page-components/WidgetBuilderHeader";
import ComponentLibraryPanel from "@/components/widget-builder/page-components/ComponentLibraryPanel";
import WidgetBuilderPanel from "@/components/widget-builder/page-components/WidgetBuilderPanel";
import WidgetPreviewPanel from "@/components/widget-builder/page-components/WidgetPreviewPanel";
import ApiTemplateModal from "@/components/widget-builder/modals/ApiTemplateModal";
import TooltipListModal from "@/components/widget-builder/modals/TooltipListModal";
import { useApiTemplateHandler } from "@/components/widget-builder/page-components/ApiTemplateHandler";
import { useWidgetActions } from "@/components/widget-builder/page-components/WidgetActions";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";

const Index = () => {
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

  // Use the widget actions hook
  const {
    handleSaveWidget,
    handleLoadWidget,
    handleNewWidget,
    handleCancelEditing,
    onSubmitSuccess: handleSubmitSuccess
  } = useWidgetActions(
    widgetComponents,
    apis,
    tooltips,
    isEditing,
    widgetId,
    navigate,
    setIsEditing
  );

  // Use the API template handler hook
  const apiTemplateHandler = useApiTemplateHandler(
    widgetComponents,
    apis,
    selectedComponentId,
    handleUpdateComponent,
    handleAddApi,
    setIsApiTemplateModalOpen
  );

  // Use the drag and drop handler
  const { handleDragEnd } = useDragAndDrop({
    onAddComponent: handleAddComponent
  });

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
            tooltips={tooltips}
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
