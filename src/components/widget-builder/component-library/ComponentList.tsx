
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { WidgetComponent, ComponentType } from '@/types/widget-types';
import ComponentCard from './ComponentCard';
import { useComponentCategories } from './useComponentCategories';

interface ComponentListProps {
  activeCategory: string;
  searchQuery: string;
  sortAZ: boolean;
  selectedComponents: ComponentType[];
  existingComponents: WidgetComponent[];
  onToggleSelect: (componentType: ComponentType) => void;
  onAddComponent: (component: WidgetComponent | ComponentType) => void;
  hasMultiSelect: boolean;
}

const ComponentList: React.FC<ComponentListProps> = ({
  activeCategory,
  searchQuery,
  sortAZ,
  selectedComponents,
  existingComponents,
  onToggleSelect,
  onAddComponent,
  hasMultiSelect
}) => {
  const { 
    getDisplayedComponents,
    getComponentIcon,
    getComponentTitle,
    getComponentDescription 
  } = useComponentCategories();

  const displayedComponents = getDisplayedComponents(activeCategory, searchQuery, sortAZ);

  // Check if an alert component already exists
  const alertExists = existingComponents.some(c => c.type === 'alert');
  const hasExistingHeader = existingComponents.some(c => c.type === 'header');

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-3">
        {displayedComponents.map((componentType) => {
          const isHeader = componentType === 'header';
          const isAlert = componentType === 'alert';
          const isDisabled = (isHeader && hasExistingHeader) || (isAlert && alertExists);
          
          return (
            <ComponentCard
              key={componentType}
              componentType={componentType}
              isDisabled={isDisabled}
              isSelected={selectedComponents.includes(componentType)}
              hasMultiSelect={hasMultiSelect}
              icon={getComponentIcon(componentType)}
              title={getComponentTitle(componentType)}
              description={getComponentDescription(componentType)}
              onToggleSelect={onToggleSelect}
              onAddComponent={onAddComponent}
            />
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default ComponentList;
