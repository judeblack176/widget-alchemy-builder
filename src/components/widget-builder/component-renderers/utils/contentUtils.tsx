
/**
 * Utility functions for content processing and cleaning
 */

// Helper function to clean HTML content for display in editor
export const cleanHtmlContent = (content: string): string => {
  if (!content) return '';
  
  // Remove HTML tags for display
  let cleanContent = content
    .replace(/<strong>(.*?)<\/strong>/g, '$1')
    .replace(/<em>(.*?)<\/em>/g, '$1')
    .replace(/<span class="align-left">(.*?)<\/span>/g, '$1')
    .replace(/<span class="align-center">(.*?)<\/span>/g, '$1')
    .replace(/<span class="align-right">(.*?)<\/span>/g, '$1')
    .replace(/<span class="color-[^"]*">(.*?)<\/span>/g, '$1')
    .replace(/<span class="background-color-[^"]*">(.*?)<\/span>/g, '$1')
    .replace(/<span class="size-[^"]*">(.*?)<\/span>/g, '$1');
  
  // Handle any remaining HTML tags
  cleanContent = cleanContent.replace(/<[^>]*>(.*?)<\/[^>]*>/g, '$1');
  
  return cleanContent;
};
