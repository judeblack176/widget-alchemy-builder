
import React, { useState } from 'react';
import { WidgetComponent, ComponentType } from '@/types/widget-types';
import { Search, ArrowDownAZ } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ComponentTabs from './ComponentTabs';
import ComponentList from './ComponentList';
import SelectedComponentsFooter from './SelectedComponentsFooter';

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

  const handleToggleSelectComponent = (componentType: ComponentType) => {
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

  return (
    <div className="h-full flex flex-col">
      <ComponentTabs 
        activeCategory={activeCategory}
        onChangeCategory={setActiveCategory}
      />
      
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
        <button 
          className={`inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground ${sortAZ ? 'bg-blue-50' : ''}`}
          onClick={toggleSort}
          title="Sort A-Z"
        >
          <ArrowDownAZ className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex-1 pt-2 m-0">
        <ComponentList
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          sortAZ={sortAZ}
          selectedComponents={selectedComponents}
          existingComponents={existingComponents}
          onToggleSelect={handleToggleSelectComponent}
          onAddComponent={onAddComponent}
          hasMultiSelect={!!onAddMultipleComponents}
        />
      </div>
      
      {onAddMultipleComponents && selectedComponents.length > 0 && (
        <SelectedComponentsFooter 
          selectedCount={selectedComponents.length}
          onAddSelected={handleAddMultiple}
        />
      )}
    </div>
  );
};

export default ComponentLibrary;
