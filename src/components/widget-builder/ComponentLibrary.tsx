import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WidgetComponent, ComponentType } from '@/types/widget-types';
import { Search, ArrowDownAZ, ArrowUpAZ } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ComponentLibraryProps {
  onAddComponent: (component: WidgetComponent | ComponentType) => void;
  onAddMultipleComponents?: (componentTypes: ComponentType[]) => void;
  existingComponents?: WidgetComponent[];
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ 
  onAddComponent, 
  onAddMultipleComponents,
  existingComponents = []
}) => {
  const [selectedComponents, setSelectedComponents] = useState<ComponentType[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortAZ, setSortAZ] = useState<boolean>(false);

  const priorityComponents: ComponentType[] = ['header', 'alert'];
  const regularComponents: ComponentType[] = [
    'text',
    'button',
    'image',
    'chart',
    'form',
    'video',
    'calendar',
    'dropdown',
    'link',
    'multi-text',
    'filter',
    'table',
    'searchbar'
  ];

  const components: ComponentType[] = [...priorityComponents, ...regularComponents];

  type CategoryMap = {
    [key: string]: ComponentType[];
  };

  const componentCategories: CategoryMap = {
    all: components,
    layout: ['header', 'text', 'image', 'alert'],
    input: ['form', 'dropdown', 'multi-text', 'filter', 'searchbar'],
    interactive: ['button', 'link', 'calendar', 'chart', 'table', 'video']
  };

  const getComponentTitle = (componentType: ComponentType): string => {
    return componentType.charAt(0).toUpperCase() + componentType.slice(1).replace(/-/g, ' ');
  };

  const getComponentDescription = (componentType: ComponentType): string => {
    switch(componentType) {
      case 'header':
        return 'A widget title with customizable icon and actions';
      case 'text':
        return 'Simple text content with formatting options';
      case 'button':
        return 'Interactive button with configurable actions';
      case 'image':
        return 'Display images with optional captions';
      case 'chart':
        return 'Data visualization using various chart types';
      case 'form':
        return 'Input field for collecting user information';
      case 'video':
        return 'Embed video content from various sources';
      case 'alert':
        return 'Highlighted message for important information';
      case 'calendar':
        return 'Date picker or calendar display';
      case 'dropdown':
        return 'Selection from a list of options';
      case 'link':
        return 'Clickable link to navigate to another page';
      case 'multi-text':
        return 'Multi-line text input for longer content';
      case 'filter':
        return 'Filter data based on selected criteria';
      case 'table':
        return 'Display tabular data with rows and columns';
      case 'searchbar':
        return 'Allow users to search through content';
      default:
        return 'Add this component to your widget';
    }
  };

  const toggleSelectComponent = (componentType: ComponentType) => {
    setSelectedComponents(prevSelected => 
      prevSelected.includes(componentType)
        ? prevSelected.filter(c => c !== componentType)
        : [...prevSelected, componentType]
    );
  };

  const handleAddMultiple = () => {
    if (onAddMultipleComponents && selectedComponents.length > 0) {
      onAddMultipleComponents(selectedComponents);
      setSelectedComponents([]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleSort = () => {
    setSortAZ(!sortAZ);
  };

  const getDisplayedComponents = () => {
    let categoryComponents = componentCategories[activeCategory as keyof typeof componentCategories] || components;
    
    const priorityComponentsInCategory = categoryComponents.filter(c => priorityComponents.includes(c));
    let regularComponentsInCategory = categoryComponents.filter(c => !priorityComponents.includes(c));
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      priorityComponentsInCategory.filter(c => 
        getComponentTitle(c).toLowerCase().includes(query) || 
        getComponentDescription(c).toLowerCase().includes(query)
      );
      regularComponentsInCategory = regularComponentsInCategory.filter(c => 
        getComponentTitle(c).toLowerCase().includes(query) || 
        getComponentDescription(c).toLowerCase().includes(query)
      );
    }
    
    if (sortAZ) {
      regularComponentsInCategory.sort((a, b) => getComponentTitle(a).localeCompare(getComponentTitle(b)));
    }
    
    return [...priorityComponentsInCategory, ...regularComponentsInCategory];
  };

  const displayedComponents = getDisplayedComponents();
  
  const alertExists = existingComponents.some(c => c.type === 'alert');

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="flex-1 flex flex-col">
        <div className="pb-2 border-b">
          <TabsList className="w-full justify-start rounded-none bg-transparent p-0">
            <TabsTrigger value="all" className="rounded text-xs px-3 py-1.5 data-[state=active]:bg-blue-50">All</TabsTrigger>
            <TabsTrigger value="layout" className="rounded text-xs px-3 py-1.5 data-[state=active]:bg-blue-50">Layout</TabsTrigger>
            <TabsTrigger value="input" className="rounded text-xs px-3 py-1.5 data-[state=active]:bg-blue-50">Input</TabsTrigger>
            <TabsTrigger value="interactive" className="rounded text-xs px-3 py-1.5 data-[state=active]:bg-blue-50">Interactive</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="pt-3 pb-2 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              type="text" 
              placeholder="Search components..." 
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-8 h-8 text-sm"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className={`h-8 px-2 ${sortAZ ? 'bg-blue-50' : ''}`} 
            onClick={toggleSort}
            title={sortAZ ? "Sort Z-A" : "Sort A-Z"}
          >
            {sortAZ ? <ArrowUpAZ className="h-4 w-4" /> : <ArrowDownAZ className="h-4 w-4" />}
          </Button>
        </div>
        
        <TabsContent value={activeCategory} className="flex-1 pt-2 m-0">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-3">
              {displayedComponents.map((componentType) => {
                const hasMultiSelect = !!onAddMultipleComponents;
                const isHeader = componentType === 'header';
                const isAlert = componentType === 'alert';
                const hasExistingHeader = existingComponents.some(c => c.type === 'header');
                const isDisabled = (isHeader && hasExistingHeader) || (isAlert && alertExists);
                
                return (
                  <Card 
                    key={componentType}
                    className={`relative border cursor-pointer transition-all ${
                      isDisabled ? 'opacity-50 pointer-events-none' : 'hover:border-blue-500'
                    } ${selectedComponents.includes(componentType) ? 'border-blue-500 bg-blue-50' : ''}`}
                    data-component-type={componentType}
                    onClick={() => hasMultiSelect ? toggleSelectComponent(componentType) : onAddComponent(componentType)}
                  >
                    {hasMultiSelect && (
                      <div className="absolute top-3 right-3 z-10">
                        <Checkbox 
                          checked={selectedComponents.includes(componentType)} 
                          onCheckedChange={() => toggleSelectComponent(componentType)}
                          disabled={isDisabled}
                        />
                      </div>
                    )}
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-sm font-medium">{getComponentTitle(componentType)}</CardTitle>
                      <CardDescription className="text-xs">{getComponentDescription(componentType)}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      {onAddMultipleComponents && selectedComponents.length > 0 && (
        <div className="flex-none mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {selectedComponents.length} component{selectedComponents.length > 1 ? 's' : ''} selected
            </Label>
            <Button onClick={handleAddMultiple}>
              Add Selected
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentLibrary;
