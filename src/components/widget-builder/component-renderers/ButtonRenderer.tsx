
import React from 'react';
import { WidgetComponent } from '@/types';
import { Button } from '@/components/ui/button';

interface ButtonRendererProps {
  component: WidgetComponent;
  finalProps: Record<string, any>;
}

const ButtonRenderer: React.FC<ButtonRendererProps> = ({ component, finalProps }) => {
  const handleButtonClick = () => {
    console.log('Button clicked', finalProps.label);
    if (finalProps.linkUrl) {
      const target = finalProps.openInNewTab ? '_blank' : '_self';
      window.open(finalProps.linkUrl, target);
    }
  };
  
  return (
    <div className="w-full pb-2">
      <Button
        variant={finalProps.variant || "default"}
        size="xs"
        className={`w-full ${finalProps.className || ''}`}
        onClick={handleButtonClick}
        style={{
          backgroundColor: finalProps.backgroundColor || '#3B82F6',
          color: finalProps.textColor || '#FFFFFF',
        }}
      >
        {finalProps.label || "Button"}
      </Button>
    </div>
  );
};

export default ButtonRenderer;
