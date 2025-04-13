
import React from 'react';
import parse from 'html-react-parser';

export const textRenderer = (finalProps: Record<string, any>) => {
  // Process special formatting in content
  const processFormattedContent = (content: string) => {
    if (!content) return '';
    
    // Replace spans with appropriate styling
    let formattedContent = content
      .replace(/<span class="size-small">(.*?)<\/span>/g, '<span style="font-size: 0.875rem">$1</span>')
      .replace(/<span class="size-medium">(.*?)<\/span>/g, '<span style="font-size: 1rem">$1</span>')
      .replace(/<span class="size-large">(.*?)<\/span>/g, '<span style="font-size: 1.25rem">$1</span>')
      .replace(/<span class="weight-bold">(.*?)<\/span>/g, '<span style="font-weight: bold">$1</span>')
      .replace(/<span class="style-italic">(.*?)<\/span>/g, '<span style="font-style: italic">$1</span>')
      .replace(/<span class="align-left">(.*?)<\/span>/g, '<span style="text-align: left; display: block">$1</span>')
      .replace(/<span class="align-center">(.*?)<\/span>/g, '<span style="text-align: center; display: block">$1</span>')
      .replace(/<span class="align-right">(.*?)<\/span>/g, '<span style="text-align: right; display: block">$1</span>')
      .replace(/<span class="color-default">(.*?)<\/span>/g, '<span style="color: inherit">$1</span>')
      .replace(/<span class="color-primary">(.*?)<\/span>/g, '<span style="color: #3b82f6">$1</span>')
      .replace(/<span class="color-secondary">(.*?)<\/span>/g, '<span style="color: #6b7280">$1</span>')
      .replace(/<span class="color-muted">(.*?)<\/span>/g, '<span style="color: #9ca3af">$1</span>')
      .replace(/<span class="color-accent">(.*?)<\/span>/g, '<span style="color: #8b5cf6">$1</span>');
      
    return formattedContent;
  };

  const content = finalProps.formattedContent || finalProps.content || "Text content";
  const processedContent = processFormattedContent(content);

  return (
    <div 
      className="p-3 rounded"
      style={{
        backgroundColor: finalProps.backgroundColor || 'transparent',
        color: finalProps.color === 'default' ? '#333333' : 
               finalProps.color === 'primary' ? '#3b82f6' : 
               finalProps.color === 'secondary' ? '#6b7280' : 
               finalProps.color === 'muted' ? '#9ca3af' : 
               finalProps.color === 'accent' ? '#8b5cf6' : '#333333',
        textAlign: finalProps.alignment || 'left',
      }}
    >
      <div 
        style={{
          fontSize: finalProps.size === 'small' ? '0.875rem' : finalProps.size === 'large' ? '1.25rem' : '1rem',
          fontFamily: finalProps.fontFamily || 'system-ui',
          fontWeight: finalProps.bold === 'true' ? 'bold' : 'normal',
          fontStyle: finalProps.italic === 'true' ? 'italic' : 'normal'
        }}
      >
        {parse(processedContent)}
      </div>
      {finalProps.apiData && (
        <div className="mt-1 text-xs">
          <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">API Connected</span>
        </div>
      )}
    </div>
  );
};
