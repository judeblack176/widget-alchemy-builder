
import React from 'react';
import { WidgetComponent } from '@/types';
import SearchBar from '@/components/widget-builder/SearchBar';

interface SearchbarRendererProps {
  component: WidgetComponent;
  finalProps: Record<string, any>;
}

const SearchbarRenderer: React.FC<SearchbarRendererProps> = ({ component, finalProps }) => {
  return (
    <SearchBar
      placeholder={finalProps.placeholder || "Search..."}
      onSearch={(query) => {
        console.log('Search for:', query);
        console.log('Search target:', finalProps.searchTarget);
        console.log('Target component:', finalProps.targetComponent);
      }}
      iconColor={finalProps.iconColor}
      backgroundColor={finalProps.backgroundColor}
      textColor={finalProps.textColor}
      borderColor={finalProps.borderColor}
      showIcon={finalProps.showIcon !== 'false'}
      className={finalProps.width === 'small' ? 'w-64' : 
                finalProps.width === 'medium' ? 'w-96' : 
                'w-full'}
    />
  );
};

export default SearchbarRenderer;
