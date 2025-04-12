
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ComponentType, WidgetComponent } from '@/types/widget-types';

interface ComponentCardProps {
  componentType: ComponentType;
  isDisabled: boolean;
  isSelected: boolean;
  hasMultiSelect: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onToggleSelect: (componentType: ComponentType) => void;
  onAddComponent: (component: WidgetComponent | ComponentType) => void;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  componentType,
  isDisabled,
  isSelected,
  hasMultiSelect,
  icon,
  title,
  description,
  onToggleSelect,
  onAddComponent
}) => {
  return (
    <Card 
      className={`relative border cursor-pointer transition-all ${
        isDisabled ? 'opacity-50 pointer-events-none' : 'hover:border-blue-500'
      } ${isSelected ? 'border-blue-500 bg-blue-50' : ''}`}
      data-component-type={componentType}
      onClick={() => hasMultiSelect ? onToggleSelect(componentType) : onAddComponent(componentType)}
    >
      {hasMultiSelect && (
        <div className="absolute top-3 right-3 z-10">
          <Checkbox 
            checked={isSelected} 
            onCheckedChange={() => onToggleSelect(componentType)}
            disabled={isDisabled}
          />
        </div>
      )}
      <CardHeader className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 p-1.5 rounded">
            {icon}
          </div>
          <div>
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <CardDescription className="text-xs">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ComponentCard;
