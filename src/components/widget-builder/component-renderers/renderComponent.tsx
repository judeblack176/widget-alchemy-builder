
import React from 'react';
import { WidgetComponent } from '@/types/widget-types';
import { renderComponentWithoutTooltip } from './renderComponentWithoutTooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { getTooltipContent } from './tooltipUtils';
import { Tooltip as CustomTooltip } from '../TooltipManager';

export const renderComponent = (
  component: WidgetComponent, 
  apiData?: any, 
  onDismiss?: (id: string) => void,
  tooltips?: CustomTooltip[]
) => {
  const { tooltipId } = component;
  
  if (!tooltipId) {
    return renderComponentWithoutTooltip(component, apiData, onDismiss);
  }
  
  const tooltipContent = getTooltipContent(tooltipId, tooltips);
  
  if (!tooltipContent) {
    return renderComponentWithoutTooltip(component, apiData, onDismiss);
  }
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="tooltip-trigger w-full">
          {renderComponentWithoutTooltip(component, apiData, onDismiss)}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-3">
        {tooltipContent}
      </HoverCardContent>
    </HoverCard>
  );
};
