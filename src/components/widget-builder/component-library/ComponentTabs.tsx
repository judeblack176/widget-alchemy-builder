
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      <TabsList className="w-full justify-start rounded-none bg-transparent p-0">
        <TabsTrigger 
          value="all" 
          className="rounded text-xs px-3 py-1.5 data-[state=active]:bg-blue-50"
          onClick={() => onChangeCategory('all')}
          data-state={activeCategory === 'all' ? 'active' : 'inactive'}
        >
          All
        </TabsTrigger>
        <TabsTrigger 
          value="layout" 
          className="rounded text-xs px-3 py-1.5 data-[state=active]:bg-blue-50"
          onClick={() => onChangeCategory('layout')}
          data-state={activeCategory === 'layout' ? 'active' : 'inactive'}
        >
          Layout
        </TabsTrigger>
        <TabsTrigger 
          value="input" 
          className="rounded text-xs px-3 py-1.5 data-[state=active]:bg-blue-50"
          onClick={() => onChangeCategory('input')}
          data-state={activeCategory === 'input' ? 'active' : 'inactive'}
        >
          Input
        </TabsTrigger>
        <TabsTrigger 
          value="interactive" 
          className="rounded text-xs px-3 py-1.5 data-[state=active]:bg-blue-50"
          onClick={() => onChangeCategory('interactive')}
          data-state={activeCategory === 'interactive' ? 'active' : 'inactive'}
        >
          Interactive
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default ComponentTabs;
