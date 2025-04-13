
import React from 'react';
import { WidgetComponent } from '@/types/widget-types';
import { processApiData } from './dataUtils';
import { headerRenderer } from './renderers/headerRenderer';
import { textRenderer } from './renderers/textRenderer';
import { imageRenderer } from './renderers/imageRenderer';
import { buttonRenderer } from './renderers/buttonRenderer';
import { videoRenderer } from './renderers/videoRenderer';
import { chartRenderer } from './renderers/chartRenderer';
import { formRenderer } from './renderers/formRenderer';
import { calendarRenderer } from './renderers/calendarRenderer';
import { dropdownRenderer } from './renderers/dropdownRenderer';
import { linkRenderer } from './renderers/linkRenderer';
import { multiTextRenderer } from './renderers/multiTextRenderer';
import { filterRenderer } from './renderers/filterRenderer';
import { alertRenderer } from './renderers/alertRenderer';
import { tableRenderer } from './renderers/tableRenderer';
import { searchBarRenderer } from './renderers/searchBarRenderer';

export const renderComponentWithoutTooltip = (component: WidgetComponent, apiData?: any, onDismiss?: (id: string) => void) => {
  const { props, type, id } = component;
  
  if (!type) {
    console.error('Component has no type defined:', component);
    return (
      <div className="p-3 bg-red-50 border border-red-200 rounded">
        <p className="text-red-500">Invalid component: missing type property</p>
      </div>
    );
  }
  
  const finalProps = processApiData(component, apiData);
  
  switch (type) {
    case 'header':
      return headerRenderer(finalProps);
    case 'text':
      return textRenderer(finalProps);
    case 'image':
      return imageRenderer(finalProps);
    case 'button':
      return buttonRenderer(finalProps);
    case 'video':
      return videoRenderer(finalProps);
    case 'chart':
      return chartRenderer(finalProps);
    case 'form':
      return formRenderer(finalProps);
    case 'calendar':
      return calendarRenderer(finalProps);
    case 'dropdown':
      return dropdownRenderer(finalProps);
    case 'link':
      return linkRenderer(finalProps);
    case 'multi-text':
      return multiTextRenderer(finalProps);
    case 'filter':
      return filterRenderer(finalProps);
    case 'alert':
      return alertRenderer(finalProps, id, onDismiss);
    case 'table':
      return tableRenderer(finalProps);
    case 'searchbar':
      return searchBarRenderer(finalProps);
    default:
      console.error(`Unsupported component type: ${type}`);
      return (
        <div className="p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-500">Unsupported component type: {type}</p>
        </div>
      );
  }
};
