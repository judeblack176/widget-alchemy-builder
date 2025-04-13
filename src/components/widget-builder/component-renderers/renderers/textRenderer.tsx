
import React from 'react';
import parse from 'html-react-parser';

export const textRenderer = (finalProps: Record<string, any>) => {
  // Process special formatting in content
  const processFormattedContent = (content: string) => {
    if (!content) return '';
    
    // Replace spans with appropriate styling
    let formattedContent = content
      // Size formatting
      .replace(/<span class="size-small">(.*?)<\/span>/g, '<span style="font-size: 0.875rem">$1</span>')
      .replace(/<span class="size-medium">(.*?)<\/span>/g, '<span style="font-size: 1rem">$1</span>')
      .replace(/<span class="size-large">(.*?)<\/span>/g, '<span style="font-size: 1.25rem">$1</span>')
      
      // Format <strong> tags directly
      .replace(/<strong>(.*?)<\/strong>/g, '<span style="font-weight: bold">$1</span>')
      
      // Format <em> tags directly
      .replace(/<em>(.*?)<\/em>/g, '<span style="font-style: italic">$1</span>')
      
      // Weight formatting (for compatibility with older content)
      .replace(/<span class="weight-bold">(.*?)<\/span>/g, '<span style="font-weight: bold">$1</span>')
      
      // Style formatting (for compatibility with older content)
      .replace(/<span class="style-italic">(.*?)<\/span>/g, '<span style="font-style: italic">$1</span>')
      
      // Alignment formatting
      .replace(/<span class="align-left">(.*?)<\/span>/g, '<span style="text-align: left; display: block">$1</span>')
      .replace(/<span class="align-center">(.*?)<\/span>/g, '<span style="text-align: center; display: block">$1</span>')
      .replace(/<span class="align-right">(.*?)<\/span>/g, '<span style="text-align: right; display: block">$1</span>')
      
      // Basic color formatting
      .replace(/<span class="color-default">(.*?)<\/span>/g, '<span style="color: inherit">$1</span>')
      .replace(/<span class="color-primary">(.*?)<\/span>/g, '<span style="color: #3b82f6">$1</span>')
      .replace(/<span class="color-secondary">(.*?)<\/span>/g, '<span style="color: #6b7280">$1</span>')
      .replace(/<span class="color-muted">(.*?)<\/span>/g, '<span style="color: #9ca3af">$1</span>')
      .replace(/<span class="color-accent">(.*?)<\/span>/g, '<span style="color: #8b5cf6">$1</span>')
      
      // Additional colors from color picker
      .replace(/<span class="color-black">(.*?)<\/span>/g, '<span style="color: #000000">$1</span>')
      .replace(/<span class="color-white">(.*?)<\/span>/g, '<span style="color: #FFFFFF">$1</span>')
      .replace(/<span class="color-red">(.*?)<\/span>/g, '<span style="color: #ef4444">$1</span>')
      .replace(/<span class="color-green">(.*?)<\/span>/g, '<span style="color: #10b981">$1</span>')
      .replace(/<span class="color-yellow">(.*?)<\/span>/g, '<span style="color: #f59e0b">$1</span>')
      .replace(/<span class="color-blue">(.*?)<\/span>/g, '<span style="color: #3b82f6">$1</span>')
      .replace(/<span class="color-purple">(.*?)<\/span>/g, '<span style="color: #8b5cf6">$1</span>')
      .replace(/<span class="color-pink">(.*?)<\/span>/g, '<span style="color: #ec4899">$1</span>')
      .replace(/<span class="color-orange">(.*?)<\/span>/g, '<span style="color: #f97316">$1</span>');
      
    // Handle any hex color that might have been added
    const hexColorRegex = /<span class="color-([0-9a-f]{6})">(.*?)<\/span>/gi;
    formattedContent = formattedContent.replace(hexColorRegex, '<span style="color: #$1">$2</span>');
    
    // Add background color formatting - use the same variable instead of redeclaring
    formattedContent = formattedContent
      // Background color formatting
      .replace(/<span class="background-color-black">(.*?)<\/span>/g, '<span style="background-color: #000000">$1</span>')
      .replace(/<span class="background-color-white">(.*?)<\/span>/g, '<span style="background-color: #FFFFFF; border: 1px solid #e0e0e0">$1</span>')
      .replace(/<span class="background-color-primary">(.*?)<\/span>/g, '<span style="background-color: #3b82f6; color: white">$1</span>')
      .replace(/<span class="background-color-secondary">(.*?)<\/span>/g, '<span style="background-color: #6b7280; color: white">$1</span>')
      .replace(/<span class="background-color-muted">(.*?)<\/span>/g, '<span style="background-color: #9ca3af; color: white">$1</span>')
      .replace(/<span class="background-color-accent">(.*?)<\/span>/g, '<span style="background-color: #8b5cf6; color: white">$1</span>')
      .replace(/<span class="background-color-red">(.*?)<\/span>/g, '<span style="background-color: #ef4444; color: white">$1</span>')
      .replace(/<span class="background-color-green">(.*?)<\/span>/g, '<span style="background-color: #10b981; color: white">$1</span>')
      .replace(/<span class="background-color-yellow">(.*?)<\/span>/g, '<span style="background-color: #f59e0b">$1</span>')
      .replace(/<span class="background-color-blue">(.*?)<\/span>/g, '<span style="background-color: #3b82f6; color: white">$1</span>')
      .replace(/<span class="background-color-purple">(.*?)<\/span>/g, '<span style="background-color: #8b5cf6; color: white">$1</span>')
      .replace(/<span class="background-color-pink">(.*?)<\/span>/g, '<span style="background-color: #ec4899; color: white">$1</span>')
      .replace(/<span class="background-color-orange">(.*?)<\/span>/g, '<span style="background-color: #f97316; color: white">$1</span>');
    
    // Handle any hex background color that might have been added
    const hexBackgroundColorRegex = /<span class="background-color-([0-9a-f]{6})">(.*?)<\/span>/gi;
    formattedContent = formattedContent.replace(hexBackgroundColorRegex, '<span style="background-color: #$1">$2</span>');
    
    return formattedContent;
  };

  const content = finalProps.formattedContent || finalProps.content || "Text content";
  const processedContent = processFormattedContent(content);
  
  // Determine if there's a background color specified in the formatted content
  let backgroundColor = finalProps.backgroundColor || 'transparent';
  
  if (content && content.includes('background-color')) {
    const bgMatch = content.match(/<span class="background-color-([a-z0-9]+)">/i);
    if (bgMatch && bgMatch[1]) {
      const colorName = bgMatch[1];
      // Map color names to actual colors
      const colorMap: Record<string, string> = {
        'black': '#000000',
        'white': '#FFFFFF',
        'primary': '#3b82f6',
        'secondary': '#6b7280',
        'muted': '#9ca3af',
        'accent': '#8b5cf6',
        'red': '#ef4444',
        'green': '#10b981',
        'blue': '#3b82f6',
        'purple': '#8b5cf6',
        'pink': '#ec4899',
        'orange': '#f97316',
        'yellow': '#f59e0b'
      };
      
      if (colorMap[colorName]) {
        backgroundColor = colorMap[colorName];
      }
      
      // Check if it's a hex color
      if (/^[0-9a-f]{6}$/i.test(colorName)) {
        backgroundColor = `#${colorName}`;
      }
    }
  }

  return (
    <div 
      className="p-3 rounded"
      style={{
        backgroundColor: backgroundColor,
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
