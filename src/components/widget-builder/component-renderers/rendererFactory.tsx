
import React from 'react';
import { WidgetComponent, ComponentType } from '@/types/widget-types';
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

// Map component types to their respective renderer functions
const rendererMap: Record<ComponentType, (props: Record<string, any>, id?: string, onDismiss?: (id: string) => void) => React.ReactNode> = {
  header: headerRenderer,
  text: textRenderer,
  image: imageRenderer,
  button: buttonRenderer,
  video: videoRenderer,
  chart: chartRenderer,
  form: formRenderer,
  calendar: calendarRenderer,
  dropdown: dropdownRenderer,
  link: linkRenderer,
  'multi-text': multiTextRenderer,
  filter: filterRenderer,
  alert: alertRenderer,
  table: tableRenderer,
  searchbar: searchBarRenderer
};

/**
 * Get the appropriate renderer for a component type
 */
export const getRendererForType = (type: ComponentType) => {
  return rendererMap[type] || null;
};

/**
 * Render an error component for unsupported or invalid components
 */
export const renderErrorComponent = (message: string) => {
  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded">
      <p className="text-red-500">{message}</p>
    </div>
  );
};
