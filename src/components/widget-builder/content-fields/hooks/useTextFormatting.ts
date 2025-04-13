
import { useState, useRef, useEffect } from "react";
import { WidgetComponent } from "@/types/widget-types";
import { useToast } from "@/hooks/use-toast";
import { applyTextFormatting, addApiPlaceholderToContent } from "./utils/formattingUtils";
import { handleTextSelection, updateCursorPosition } from "./utils/selectionUtils";
import { handleInputClick, handleInputFocus } from "./utils/eventHandlers";

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

  // Handle selection in the textarea
  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    handleTextSelection(e, setSelectedText);
  };

  const handleSingleLineSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
    handleTextSelection(e, setSelectedText);
  };

  // Apply formatting to selected text
  const applyFormatting = (format: string, value: string) => {
    const content = component.formattedContent || "";
    
    const newContent = applyTextFormatting(format, value, selectedText, content, toast);
    
    if (newContent) {
      handleFormattedContentChange(newContent);
      
      // Reset selection after applying format to avoid seeing HTML tags
      setSelectedText(null);
      
      toast({
        title: "Format applied",
        description: `Applied ${format}: ${value} to text.`
      });
    }
  };

  const addApiPlaceholder = (placeholder: string) => {
    const currentContent = component.formattedContent || "";
    const newContent = addApiPlaceholderToContent(placeholder, currentContent, toast);
    
    if (newContent) {
      handleFormattedContentChange(newContent);
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
