
import React from 'react';
import { WidgetComponent } from '@/types';

interface ImageRendererProps {
  component: WidgetComponent;
  finalProps: Record<string, any>;
}

const ImageRenderer: React.FC<ImageRendererProps> = ({ component, finalProps }) => {
  const heightStyles = finalProps.height === 'auto' ? {} : 
    finalProps.height === 'small' ? { height: '100px' } :
    finalProps.height === 'medium' ? { height: '200px' } :
    finalProps.height === 'large' ? { height: '400px' } : {};
  
  const borderRadiusStyles = finalProps.borderRadius === 'none' ? {} :
    finalProps.borderRadius === 'small' ? { borderRadius: '4px' } :
    finalProps.borderRadius === 'medium' ? { borderRadius: '8px' } :
    finalProps.borderRadius === 'large' ? { borderRadius: '16px' } :
    finalProps.borderRadius === 'circle' ? { borderRadius: '50%' } : {};
    
  const objectFitStyle = finalProps.objectFit || 'cover';
  
  return (
    <figure className="relative" style={{ width: finalProps.width || 'auto' }}>
      <img 
        src={finalProps.source || "https://via.placeholder.com/150"}
        alt={finalProps.altText || "Image"} 
        className="w-full"
        style={{
          ...heightStyles,
          ...borderRadiusStyles,
          objectFit: objectFitStyle
        }}
      />
      {finalProps.caption && (
        <figcaption className="text-sm text-gray-500 mt-1">{finalProps.caption}</figcaption>
      )}
    </figure>
  );
};

export default ImageRenderer;
