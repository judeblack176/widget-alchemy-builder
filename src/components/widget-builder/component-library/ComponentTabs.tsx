
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface ComponentTabsProps {
  activeCategory: string;
  onChangeCategory: (category: string) => void;
}

const ComponentTabs: React.FC<ComponentTabsProps> = ({ 
  activeCategory, 
  onChangeCategory 
}) => {
  return (
    <div className="pb-2 border-b">
      <Tabs value={activeCategory} onValueChange={onChangeCategory} className="w-full">
        <TabsList className="w-full justify-start rounded-none bg-transparent p-0">
          <TabsTrigger 
            value="all" 
            className="rounded text-xs px-3 py-1.5 data-[state=active]:bg-blue-50"
          >
            All
          </TabsTrigger>
          <TabsTrigger 
            value="layout" 
            className="rounded text-xs px-3 py-1.5 data-[state=active]:bg-blue-50"
          >
            Layout
          </TabsTrigger>
          <TabsTrigger 
            value="input" 
            className="rounded text-xs px-3 py-1.5 data-[state=active]:bg-blue-50"
          >
            Input
          </TabsTrigger>
          <TabsTrigger 
            value="interactive" 
            className="rounded text-xs px-3 py-1.5 data-[state=active]:bg-blue-50"
          >
            Interactive
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ComponentTabs;
