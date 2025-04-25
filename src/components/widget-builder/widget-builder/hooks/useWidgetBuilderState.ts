
import { useState, useEffect } from 'react';
import { WidgetComponent } from '@/types/widget-types';

export const useWidgetBuilderState = (components: WidgetComponent[]) => {
  const [expandedComponentId, setExpandedComponentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const alertComponents = components.filter(c => c.type === 'alert');
  const hasAlertComponent = alertComponents.length > 0;
  
  const nonHeaderNonAlertComponents = components.filter(c => c.type !== 'header' && c.type !== 'alert');
  const MAX_COMPONENTS = hasAlertComponent ? 7 : 6;
  const atComponentLimit = nonHeaderNonAlertComponents.length >= MAX_COMPONENTS;

  const headerComponent = components.find(c => c.type === 'header');

  const filteredComponents = components.filter(component => {
    if (!searchQuery.trim()) return true;
    
    if (component.type.toLowerCase().includes(searchQuery.toLowerCase())) {
      return true;
    }
    
    for (const key in component.props) {
      if (
        typeof component.props[key] === 'string' && 
        component.props[key].toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return true;
      }
    }
    
    return false;
  });

  const filteredHeaderComponent = headerComponent && filteredComponents.includes(headerComponent) 
    ? headerComponent 
    : null;
  const filteredAlertComponents = alertComponents.filter(alert => filteredComponents.includes(alert));
  const filteredRegularComponents = filteredComponents.filter(c => c.type !== 'header' && c.type !== 'alert');

  return {
    expandedComponentId,
    setExpandedComponentId,
    searchQuery,
    setSearchQuery,
    filteredHeaderComponent,
    filteredAlertComponents,
    filteredRegularComponents,
    atComponentLimit,
    MAX_COMPONENTS,
    filteredComponents
  };
};
