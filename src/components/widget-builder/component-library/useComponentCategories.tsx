
import React from 'react';
import { ComponentType } from '@/types/widget-types';
import { 
  BookOpen, 
  Type, 
  Image, 
  Video, 
  BarChart, 
  FormInput, 
  CalendarDays, 
  List, 
  LinkIcon, 
  Text,
  Filter,
  AlertTriangle,
  Table2,
  Search
} from 'lucide-react';

export const useComponentCategories = () => {
  // Priority components that should always be at the top
  const priorityComponents: ComponentType[] = ['header', 'alert'];
  
  // Regular components
  const regularComponents: ComponentType[] = [
    'text',
    'button',
    'image',
    'chart',
    'form',
    'video',
    'calendar',
    'dropdown',
    'link',
    'multi-text',
    'filter',
    'table',
    'searchbar'
  ];

  // All components (with priority ones first)
  const components: ComponentType[] = [...priorityComponents, ...regularComponents];

  type CategoryMap = {
    [key: string]: ComponentType[];
  };

  const componentCategories: CategoryMap = {
    all: components,
    layout: ['header', 'text', 'image', 'alert'],
    input: ['form', 'dropdown', 'multi-text', 'filter', 'searchbar'],
    interactive: ['button', 'link', 'calendar', 'chart', 'table', 'video']
  };

  // Function to get the appropriate icon based on component type
  const getComponentIcon = (componentType: ComponentType) => {
    switch (componentType) {
      case 'header': return <BookOpen size={16} />;
      case 'text': return <Text size={16} />;
      case 'button': return <FormInput size={16} />;
      case 'image': return <Image size={16} />;
      case 'video': return <Video size={16} />;
      case 'chart': return <BarChart size={16} />;
      case 'calendar': return <CalendarDays size={16} />;
      case 'dropdown': return <List size={16} />;
      case 'link': return <LinkIcon size={16} />;
      case 'multi-text': return <Type size={16} />;
      case 'filter': return <Filter size={16} />;
      case 'alert': return <AlertTriangle size={16} />;
      case 'table': return <Table2 size={16} />;
      case 'searchbar': return <Search size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  const getComponentTitle = (componentType: ComponentType): string => {
    return componentType.charAt(0).toUpperCase() + componentType.slice(1).replace(/-/g, ' ');
  };

  const getComponentDescription = (componentType: ComponentType): string => {
    switch(componentType) {
      case 'header':
        return 'A widget title with customizable icon and actions';
      case 'text':
        return 'Simple text content with formatting options';
      case 'button':
        return 'Interactive button with configurable actions';
      case 'image':
        return 'Display images with optional captions';
      case 'chart':
        return 'Data visualization using various chart types';
      case 'form':
        return 'Input field for collecting user information';
      case 'video':
        return 'Embed video content from various sources';
      case 'alert':
        return 'Highlighted message for important information';
      case 'calendar':
        return 'Date picker or calendar display';
      case 'dropdown':
        return 'Selection from a list of options';
      case 'link':
        return 'Clickable link to navigate to another page';
      case 'multi-text':
        return 'Multi-line text input for longer content';
      case 'filter':
        return 'Filter data based on selected criteria';
      case 'table':
        return 'Display tabular data with rows and columns';
      case 'searchbar':
        return 'Allow users to search through content';
      default:
        return 'Add this component to your widget';
    }
  };

  // Get the components to display based on active category, search, and sort
  const getDisplayedComponents = (activeCategory: string, searchQuery: string, sortAZ: boolean) => {
    // Get the base components for the current category
    let categoryComponents = componentCategories[activeCategory as keyof typeof componentCategories] || components;
    
    // Split into priority and regular components
    const priorityComponentsInCategory = categoryComponents.filter(c => priorityComponents.includes(c));
    let regularComponentsInCategory = categoryComponents.filter(c => !priorityComponents.includes(c));
    
    // Filter by search query if set
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filteredPriorityComponents = priorityComponentsInCategory.filter(c => 
        getComponentTitle(c).toLowerCase().includes(query) || 
        getComponentDescription(c).toLowerCase().includes(query)
      );
      regularComponentsInCategory = regularComponentsInCategory.filter(c => 
        getComponentTitle(c).toLowerCase().includes(query) || 
        getComponentDescription(c).toLowerCase().includes(query)
      );
      
      // Use the filtered priority components
      return [...filteredPriorityComponents, ...regularComponentsInCategory];
    }
    
    // Sort regular components if sort is enabled
    if (sortAZ) {
      regularComponentsInCategory.sort((a, b) => getComponentTitle(a).localeCompare(getComponentTitle(b)));
    }
    
    // Combine with priority components always at the top
    return [...priorityComponentsInCategory, ...regularComponentsInCategory];
  };

  return {
    components,
    priorityComponents,
    regularComponents,
    componentCategories,
    getComponentIcon,
    getComponentTitle,
    getComponentDescription,
    getDisplayedComponents
  };
};
