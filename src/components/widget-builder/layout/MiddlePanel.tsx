
import React from 'react';
import { useWidget } from '@/contexts/WidgetContext';
import { Droppable } from 'react-beautiful-dnd';
import WidgetBuilder from '@/components/widget-builder/WidgetBuilder';
import ActionToolbar from './ActionToolbar';

const MiddlePanel: React.FC = () => {
  const { 
    widgetComponents, 
    apis, 
    tooltips,
    handleUpdateComponent,
    handleRemoveComponent,
    handleReorderComponents,
    openApiTemplateModal,
    handleApplyTooltip
  } = useWidget();

  return (
    <div className="w-2/5 bg-widget-gray overflow-hidden flex flex-col">
      <ActionToolbar title="Widget Builder" />
      
      <div className="flex-1 overflow-hidden px-4 pb-4">
        <Droppable droppableId="widget-builder">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="h-full"
            >
              <WidgetBuilder
                components={widgetComponents}
                apis={apis}
                onUpdateComponent={handleUpdateComponent}
                onRemoveComponent={handleRemoveComponent}
                onReorderComponents={handleReorderComponents}
                onRequestApiTemplate={openApiTemplateModal}
                onApplyTooltip={handleApplyTooltip}
                tooltips={tooltips}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default MiddlePanel;
