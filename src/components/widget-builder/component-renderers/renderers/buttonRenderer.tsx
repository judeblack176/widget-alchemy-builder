
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
  
  // Determine alignment class based on alignment prop
  const alignmentClass = 
    finalProps.alignment === 'center' ? 'text-center w-full' : 
    finalProps.alignment === 'right' ? 'text-right w-full' : 
    'text-left w-full';
  
  return (
    <div className={`pb-2 ${alignmentClass}`}>
      <Button
        variant={finalProps.variant || "default"}
        size="xs"
        className={finalProps.className || ''}
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
