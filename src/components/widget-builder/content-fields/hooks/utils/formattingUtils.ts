
import { useToast } from "@/hooks/use-toast";

/**
 * Applies formatting to selected text with toggle functionality for bold and italic
 */
export const applyTextFormatting = (
  format: string,
  value: string,
  selectedText: {start: number, end: number} | null,
  content: string,
  toast: ReturnType<typeof useToast>["toast"]
): string | null => {
  try {
    if (!selectedText) {
      // Apply to entire content if no selection
      const emptySelection = {
        start: 0,
        end: content.length
      };
      selectedText = emptySelection;
    }
    
    // Validate selection is still valid
    if (selectedText.start < 0 || selectedText.end > content.length) {
      toast({
        title: "Selection changed",
        description: "The text selection has changed. Please select text again.",
        variant: "destructive"
      });
      return null;
    }
    
    const beforeSelection = content.substring(0, selectedText.start);
    const selection = content.substring(selectedText.start, selectedText.end);
    const afterSelection = content.substring(selectedText.end);
    
    if (selection.trim() === "" && content.trim() === "") {
      toast({
        title: "Empty text",
        description: "Please enter some text first.",
        variant: "destructive"
      });
      return null;
    }
    
    // Handle toggle functionality for bold and italic
    let formattedText = '';
    
    // Apply the formatting based on the format type
    switch (format) {
      case "weight":
        if (value === "bold") {
          // Check if selection is already bold
          if (selection.match(/<strong>(.*?)<\/strong>/)) {
            // If already bold, remove the bold formatting
            formattedText = selection.replace(/<strong>(.*?)<\/strong>/g, '$1');
          } else {
            // If not bold, add the bold formatting
            formattedText = `<strong>${selection}</strong>`;
          }
        }
        break;
      case "style":
        if (value === "italic") {
          // Check if selection is already italic
          if (selection.match(/<em>(.*?)<\/em>/)) {
            // If already italic, remove the italic formatting
            formattedText = selection.replace(/<em>(.*?)<\/em>/g, '$1');
          } else {
            // If not italic, add the italic formatting
            formattedText = `<em>${selection}</em>`;
          }
        }
        break;
      case "align":
        // For other formatting, we just apply it directly
        formattedText = `<span class="align-${value}">${selection}</span>`;
        break;
      case "size":
        formattedText = `<span class="size-${value}">${selection}</span>`;
        break;
      case "color":
        formattedText = `<span class="color-${value}">${selection}</span>`;
        break;
      case "background-color":
        formattedText = `<span class="background-color-${value}">${selection}</span>`;
        break;
      default:
        formattedText = selection;
    }
    
    return beforeSelection + formattedText + afterSelection;
  } catch (error) {
    console.error("Error applying text formatting:", error);
    toast({
      title: "Formatting error",
      description: "An error occurred while formatting text. Please try again.",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Adds an API placeholder to content
 */
export const addApiPlaceholderToContent = (
  placeholder: string,
  currentContent: string,
  toast: ReturnType<typeof useToast>["toast"]
): string | null => {
  try {
    toast({
      title: "Field added",
      description: `Added ${placeholder} to content.`
    });
    return currentContent + placeholder;
  } catch (error) {
    console.error("Error adding API placeholder:", error);
    toast({
      title: "Error adding field",
      description: "Failed to add API field. Please try again.",
      variant: "destructive"
    });
    return null;
  }
};
