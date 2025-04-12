
import React from 'react';
import { WidgetComponent } from '@/types/widget-types';
import { renderComponent } from '../component-renderers';

interface HeaderPreviewProps {
  headerComponent: WidgetComponent | undefined;
}

const HeaderPreview: React.FC<HeaderPreviewProps> = ({ headerComponent }) => {
  if (!headerComponent) return null;

  return (
    <div className="sticky top-0 z-20">
      {renderComponent(headerComponent)}
    </div>
  );
};

export default HeaderPreview;
