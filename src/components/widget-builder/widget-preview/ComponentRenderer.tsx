
import React from 'react';
import { WidgetComponent } from '@/types/widget-types';
import { renderComponent } from '@/components/widget-builder/component-renderers';
import { HelpCircle } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import TooltipContent from './TooltipContent';
import { Tooltip } from '../TooltipManager';

interface ComponentRendererProps {
  component: WidgetComponent;
  componentData?: any;
  index: number;
  onAlertDismiss?: (alertId: string) => void;
  headerComponent?: WidgetComponent | null;
  tooltips?: Tooltip[];
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  componentData,
  index,
  onAlertDismiss,
  headerComponent,
  tooltips = []
}) => {
  if (component.type === 'alert' && onAlertDismiss === undefined) {
    return null;
  }
  
  const componentContent = (
    <div className="relative">
      {renderComponent(
        component, 
        componentData, 
        component.type === 'alert' ? onAlertDismiss : undefined,
        tooltips // Pass tooltips to the renderComponent function
      )}
    </div>
  );
  
  const isHeader = component.type === 'header';
  const withTooltip = component.tooltipId && component.tooltipId !== "";

  const containerClassName = `widget-component relative ${
    !isHeader ? 'px-4 pt-4 border-t border-gray-200' : ''
  } ${
    index !== 0 && isHeader ? 'mt-4' : ''
  }`;

  const containerStyle = {
    borderTop: !isHeader && index !== 0 ? '1px solid #E5E7EB' : 'none',
  };

  if (withTooltip) {
    return (
      <div 
        key={component.id} 
        className={containerClassName}
        style={containerStyle}
      >
        <HoverCard openDelay={200} closeDelay={100}>
          <HoverCardTrigger asChild>
            <div className="relative cursor-help">
              {componentContent}
              <div className="absolute right-0 top-0 z-10">
                <HelpCircle size={16} className="text-gray-500" />
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 p-3">
            <TooltipContent tooltipId={component.tooltipId} customTooltips={tooltips} />
          </HoverCardContent>
        </HoverCard>
      </div>
    );
  }
  
  return (
    <div 
      key={component.id} 
      className={containerClassName}
      style={containerStyle}
    >
      {componentContent}
    </div>
  );
};

export default ComponentRenderer;
