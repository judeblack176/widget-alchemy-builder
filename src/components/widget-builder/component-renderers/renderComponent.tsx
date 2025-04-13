
import React from 'react';
import { WidgetComponent } from '@/types/widget-types';
import { renderComponentWithoutTooltip, cleanHtmlContent } from './renderComponentWithoutTooltip';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { getTooltipContent } from './tooltipUtils';
import { Tooltip as CustomTooltip } from '../TooltipManager';

export const renderComponent = (
  component: WidgetComponent, 
  apiData?: any, 
  onDismiss?: (id: string) => void,
  tooltips?: CustomTooltip[]
) => {
  const { tooltipId } = component;
  
  // Make sure component title/content display is clean (without HTML tags)
  let processedComponent = component;
  if (component.formattedContent) {
    processedComponent = {
      ...component,
      props: {
        ...component.props,
        displayContent: cleanHtmlContent(component.formattedContent)
      }
    };
  }
  
  if (!tooltipId) {
    return renderComponentWithoutTooltip(processedComponent, apiData, onDismiss);
  }
  
  const tooltipContent = getTooltipContent(tooltipId, tooltips);
  
  if (!tooltipContent) {
    return renderComponentWithoutTooltip(processedComponent, apiData, onDismiss);
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="tooltip-trigger w-full">
            {renderComponentWithoutTooltip(processedComponent, apiData, onDismiss)}
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-80 p-3">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
