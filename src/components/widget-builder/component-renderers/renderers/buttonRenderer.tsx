
import React from 'react';
import { Button } from '@/components/ui/button';

export const buttonRenderer = (finalProps: Record<string, any>) => {
  const handleButtonClick = () => {
    console.log('Button clicked', finalProps.label);
    if (finalProps.linkUrl) {
      const target = finalProps.openInNewTab ? '_blank' : '_self';
      window.open(finalProps.linkUrl, target);
    }
  };
  
  return (
    <div className="inline-block w-1/2 pr-1 pb-2">
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
