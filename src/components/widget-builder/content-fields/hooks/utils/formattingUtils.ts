
import { useToast } from "@/hooks/use-toast";

/**
 * Applies formatting to selected text
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
      toast({
        title: "No text selected",
        description: "Please select some text to format it.",
        variant: "destructive"
      });
      return null;
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
    
    if (selection.trim() === "") {
      toast({
        title: "Empty selection",
        description: "Cannot format empty text. Please select some text.",
        variant: "destructive"
      });
      return null;
    }
    
    // Create formatted text with the appropriate tag
    let formattedText = '';
    
    // Apply the formatting based on the format type
    switch (format) {
      case "weight":
        if (value === "bold") {
          formattedText = `<strong>${selection}</strong>`;
        }
        break;
      case "style":
        if (value === "italic") {
          formattedText = `<em>${selection}</em>`;
        }
        break;
      case "align":
        formattedText = `<span class="text-${value}">${selection}</span>`;
        break;
      case "size":
        formattedText = `<span class="text-${value}">${selection}</span>`;
        break;
      case "color":
      case "background-color":
        formattedText = `<span class="${format}-${value}">${selection}</span>`;
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
