
import React from 'react';
import { getIconByName } from '../iconUtils';
import parse from 'html-react-parser';

export const headerRenderer = (finalProps: Record<string, any>) => {
  // Process the header content
  const headerContent = finalProps.formattedContent || finalProps.name || "Header";
  
  // Process formatted content for the header
  const processFormattedContent = (content: string) => {
    if (!content || typeof content !== 'string') return content;
    
    // Replace formatting tags with styled spans
    let formattedContent = content
      // Handle bold formatting
      .replace(/<strong>(.*?)<\/strong>/g, '<span style="font-weight: bold">$1</span>')
      
      // Handle italic formatting
      .replace(/<em>(.*?)<\/em>/g, '<span style="font-style: italic">$1</span>')
      
      // Handle color formatting
      .replace(/<span class="color-default">(.*?)<\/span>/g, '<span style="color: inherit">$1</span>')
      .replace(/<span class="color-primary">(.*?)<\/span>/g, '<span style="color: #3b82f6">$1</span>')
      .replace(/<span class="color-secondary">(.*?)<\/span>/g, '<span style="color: #6b7280">$1</span>')
      .replace(/<span class="color-muted">(.*?)<\/span>/g, '<span style="color: #9ca3af">$1</span>')
      .replace(/<span class="color-accent">(.*?)<\/span>/g, '<span style="color: #8b5cf6">$1</span>')
      .replace(/<span class="color-black">(.*?)<\/span>/g, '<span style="color: #000000">$1</span>')
      .replace(/<span class="color-white">(.*?)<\/span>/g, '<span style="color: #FFFFFF">$1</span>')
      .replace(/<span class="color-red">(.*?)<\/span>/g, '<span style="color: #ef4444">$1</span>')
      .replace(/<span class="color-green">(.*?)<\/span>/g, '<span style="color: #10b981">$1</span>')
      .replace(/<span class="color-blue">(.*?)<\/span>/g, '<span style="color: #3b82f6">$1</span>')
      .replace(/<span class="color-purple">(.*?)<\/span>/g, '<span style="color: #8b5cf6">$1</span>')
      .replace(/<span class="color-pink">(.*?)<\/span>/g, '<span style="color: #ec4899">$1</span>')
      .replace(/<span class="color-orange">(.*?)<\/span>/g, '<span style="color: #f97316">$1</span>')
      
      // Handle background color formatting
      .replace(/<span class="background-color-black">(.*?)<\/span>/g, '<span style="background-color: #000000">$1</span>')
      .replace(/<span class="background-color-white">(.*?)<\/span>/g, '<span style="background-color: #FFFFFF; border: 1px solid #e0e0e0">$1</span>')
      .replace(/<span class="background-color-primary">(.*?)<\/span>/g, '<span style="background-color: #3b82f6; color: white">$1</span>')
      .replace(/<span class="background-color-secondary">(.*?)<\/span>/g, '<span style="background-color: #6b7280; color: white">$1</span>')
      .replace(/<span class="background-color-red">(.*?)<\/span>/g, '<span style="background-color: #ef4444; color: white">$1</span>')
      .replace(/<span class="background-color-green">(.*?)<\/span>/g, '<span style="background-color: #10b981; color: white">$1</span>')
      .replace(/<span class="background-color-blue">(.*?)<\/span>/g, '<span style="background-color: #3b82f6; color: white">$1</span>');
    
    return formattedContent;
  };

  // Process the content with formatting if needed
  const processedContent = processFormattedContent(headerContent);
  const hasFormatting = typeof headerContent === 'string' && headerContent.includes('<');
  
  // Determine background color
  const backgroundColor = finalProps.backgroundColor || '#3B82F6';
  
  return (
    <div 
      className="w-full p-3 sticky top-0 z-10"
      style={{
        backgroundColor: backgroundColor,
        color: finalProps.textColor || '#FFFFFF',
        marginTop: 0,
        marginLeft: -16,
        marginRight: -16,
        width: 'calc(100% + 32px)',
      }}
    >
      <div className="flex items-center text-left pl-4">
        {getIconByName(finalProps.icon || 'BookOpen')}
        <div className="ml-3 overflow-hidden text-ellipsis whitespace-nowrap">
          {hasFormatting 
            ? parse(processedContent) 
            : <h2 className="text-left text-ellipsis overflow-hidden whitespace-nowrap">{processedContent}</h2>}
        </div>
      </div>
    </div>
  );
};
