
import React from 'react';
import { WidgetComponent } from '@/types';
import PreviewComponent from './PreviewComponent';

interface PreviewHeaderProps {
  headerComponent: WidgetComponent | undefined;
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({ headerComponent }) => {
  if (!headerComponent) return null;
  
  return (
    <div className="sticky top-0 z-20">
      <PreviewComponent 
        component={headerComponent} 
        index={0}
      />
    </div>
  );
};

export default PreviewHeader;
