
import { useState, useRef, useEffect } from "react";
import { WidgetComponent } from "@/types/widget-types";
import { useToast } from "@/hooks/use-toast";

interface TextFormattingHookResult {
  selectedText: {start: number, end: number} | null;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  handleFormattedContentChange: (value: string) => void;
  handleInputClick: (e: React.MouseEvent) => void;
  handleInputFocus: (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  handleTextareaSelect: (e: React.SyntheticEvent<HTMLTextAreaElement>) => void;
  handleSingleLineSelect: (e: React.SyntheticEvent<HTMLInputElement>) => void;
  applyFormatting: (format: string, value: string) => void;
  addApiPlaceholder: (placeholder: string) => void;
}

export const useTextFormatting = (
  component: WidgetComponent,
  onUpdateComponent: (updatedComponent: WidgetComponent) => void
): TextFormattingHookResult => {
  const [selectedText, setSelectedText] = useState<{start: number, end: number} | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFormattedContentChange = (value: string) => {
    const updatedComponent = {
      ...component,
      formattedContent: value
    };
    onUpdateComponent(updatedComponent);
  };

  // Stop propagation on input interactions to prevent container from closing
  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Handle focus events separately with the correct event type
  const handleInputFocus = (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    e.stopPropagation();
  };

  // Handle selection in the textarea
  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    if (target.selectionStart !== target.selectionEnd) {
      setSelectedText({
        start: target.selectionStart,
        end: target.selectionEnd
      });
    } else {
      setSelectedText(null);
    }
  };

  const handleSingleLineSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.selectionStart !== target.selectionEnd) {
      setSelectedText({
        start: target.selectionStart || 0,
        end: target.selectionEnd || 0
      });
    } else {
      setSelectedText(null);
    }
  };

  // Apply formatting to selected text with error handling
  const applyFormatting = (format: string, value: string) => {
    try {
      if (!selectedText || (!textareaRef.current && !inputRef.current)) {
        toast({
          title: "No text selected",
          description: "Please select some text to format it.",
          variant: "destructive"
        });
        return;
      }
      
      const content = component.formattedContent || "";
      
      // Validate selection is still valid
      if (selectedText.start < 0 || selectedText.end > content.length) {
        setSelectedText(null);
        toast({
          title: "Selection changed",
          description: "The text selection has changed. Please select text again.",
          variant: "destructive"
        });
        return;
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
        return;
      }
      
      // Create formatted text with the appropriate tag
      let formattedText = '';
      
      // For weight and style, use HTML tags for proper formatting
      if (format === "weight" && value === "bold") {
        formattedText = `<strong>${selection}</strong>`;
      } else if (format === "style" && value === "italic") {
        formattedText = `<em>${selection}</em>`;
      } else {
        // For colors, use span with class
        formattedText = `<span class="${format}-${value}">${selection}</span>`;
      }
      
      const newContent = beforeSelection + formattedText + afterSelection;
      
      handleFormattedContentChange(newContent);
      
      // Reset selection after applying format
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          const newCursorPos = beforeSelection.length + formattedText.length;
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        } else if (textareaRef.current) {
          textareaRef.current.focus();
          const newCursorPos = beforeSelection.length + formattedText.length;
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
      
      toast({
        title: "Format applied",
        description: `Applied ${format}: ${value} to selected text.`
      });
    } catch (error) {
      console.error("Error applying text formatting:", error);
      toast({
        title: "Formatting error",
        description: "An error occurred while formatting text. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addApiPlaceholder = (placeholder: string) => {
    try {
      const currentContent = component.formattedContent || "";
      handleFormattedContentChange(currentContent + placeholder);
      
      toast({
        title: "Field added",
        description: `Added ${placeholder} to content.`
      });
    } catch (error) {
      console.error("Error adding API placeholder:", error);
      toast({
        title: "Error adding field",
        description: "Failed to add API field. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Reset selected text when content changes externally
  useEffect(() => {
    setSelectedText(null);
  }, [component.id]);

  return {
    selectedText,
    textareaRef,
    inputRef,
    handleFormattedContentChange,
    handleInputClick,
    handleInputFocus,
    handleTextareaSelect,
    handleSingleLineSelect,
    applyFormatting,
    addApiPlaceholder,
  };
};
