
import React, { useState } from 'react';
import { useWidget } from '@/contexts/WidgetContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Droppable } from 'react-beautiful-dnd';
import ComponentLibrary from '@/components/widget-builder/ComponentLibrary';
import TooltipManager from '@/components/widget-builder/TooltipManager';
import ApiManager from '@/components/widget-builder/ApiManager';
import TagsManager from '@/components/widget-builder/TagsManager';

const LeftPanel: React.FC = () => {
  const { 
    widgetComponents, 
    apis, 
    tooltips, 
    handleAddComponent, 
    handleAddApi, 
    handleRemoveApi, 
    handleUpdateApi,
    handleAddTooltip,
    handleUpdateTooltip,
    handleRemoveTooltip
  } = useWidget();
  const [activeTab, setActiveTab] = useState<string>("components");

  return (
    <div className="w-1/4 border-r border-gray-200 bg-white overflow-hidden flex flex-col">
      <div className="flex flex-col h-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          <div className="sticky top-0 bg-white z-40 pb-4 border-b">
            <TabsList className="w-full">
              <TabsTrigger value="components" className="flex-1">Components</TabsTrigger>
              <TabsTrigger value="tooltips" className="flex-1">Tooltips</TabsTrigger>
              <TabsTrigger value="apis" className="flex-1">APIs</TabsTrigger>
              <TabsTrigger value="tags" className="flex-1">Tags</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <TabsContent value="components" className="h-full mt-0">
              <ScrollArea className="h-full pb-10">
                <Droppable droppableId="component-library" isDropDisabled={true}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="h-full px-4"
                    >
                      <ComponentLibrary 
                        onAddComponent={handleAddComponent} 
                        existingComponents={widgetComponents}
                      />
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="tooltips" className="h-full mt-0">
              <ScrollArea className="h-full px-4 pb-10">
                <TooltipManager
                  tooltips={tooltips}
                  onAddTooltip={handleAddTooltip}
                  onUpdateTooltip={handleUpdateTooltip}
                  onRemoveTooltip={handleRemoveTooltip}
                />
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="apis" className="h-full mt-0">
              <ScrollArea className="h-full px-4 pb-10">
                <ApiManager 
                  apis={apis} 
                  onAddApi={handleAddApi} 
                  onRemoveApi={handleRemoveApi} 
                  onUpdateApi={handleUpdateApi}
                />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="tags" className="h-full mt-0">
              <ScrollArea className="h-full px-4 pb-10">
                <TagsManager />
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default LeftPanel;
