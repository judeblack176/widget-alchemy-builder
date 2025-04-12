
import React from 'react';
import { WidgetComponent } from '@/types';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { HelpCircle, AlertCircle } from 'lucide-react';
import { renderComponent } from '../component-renderers';

interface PreviewComponentProps {
  component: WidgetComponent;
  componentData?: any;
  index: number;
  handleAlertDismiss?: (alertId: string) => void;
}

const PreviewComponent: React.FC<PreviewComponentProps> = ({
  component,
  componentData,
  index,
  handleAlertDismiss
}) => {
  const getTooltipContent = (tooltipId: string) => {
    switch (tooltipId) {
      case "help":
        return (
          <div className="flex items-start gap-2">
            <HelpCircle size={16} className="text-blue-500 mt-0.5" />
            <span>Help information about this feature</span>
          </div>
        );
      case "info":
        return (
          <div className="flex items-start gap-2">
            <HelpCircle size={16} className="text-green-500 mt-0.5" />
            <span>Additional information about this component</span>
          </div>
        );
      case "warning":
        return (
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-amber-500 mt-0.5" />
            <span>Warning: Please review this information carefully</span>
          </div>
        );
      case "tip":
        return (
          <div className="flex items-start gap-2">
            <HelpCircle size={16} className="text-purple-500 mt-0.5" />
            <span>Pro Tip: This feature can help you save time</span>
          </div>
        );
      default:
        return "Information";
    }
  };

  const componentContent = (
    <div className="relative">
      {renderComponent(
        component, 
        componentData, 
        component.type === 'alert' ? handleAlertDismiss : undefined
      )}
    </div>
  );
  
  return (
    <div 
      className={`widget-component relative ${component.type !== 'header' ? 'px-4 pt-4 border-t border-gray-200' : ''} ${index !== 0 && component.type === 'header' ? 'mt-4' : ''}`}
      style={{
        borderTop: component.type !== 'header' && index !== 0 ? '1px solid #E5E7EB' : 'none',
      }}
    >
      {component.tooltipId && component.tooltipId !== "" ? (
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
            {getTooltipContent(component.tooltipId)}
          </HoverCardContent>
        </HoverCard>
      ) : (
        componentContent
      )}
    </div>
  );
};

export default PreviewComponent;
