
import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { WidgetComponent } from "@/types/widget-types";
import { useToast } from "@/hooks/use-toast";
import TextFormattingToolbar from "./TextFormattingToolbar";
import TextOptionsAccordion from "./TextOptionsAccordion";
import ApiFieldsDisplay from "./ApiFieldsDisplay";

interface FormattedTextEditorProps {
  component: WidgetComponent;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
}

const FormattedTextEditor: React.FC<FormattedTextEditorProps> = ({
  component,
  onUpdateComponent
}) => {
  const [selectedText, setSelectedText] = useState<{start: number, end: number} | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const handleFormattedContentChange = (value: string) => {
    const updatedComponent = {
      ...component,
      formattedContent: value
    };
    onUpdateComponent(updatedComponent);
  };

  const handlePropertyChange = (propertyName: string, value: any) => {
    const updatedComponent = {
      ...component,
      props: {
        ...component.props,
        [propertyName]: value,
      },
    };
    onUpdateComponent(updatedComponent);
  };

  // Stop propagation on input interactions to prevent container from closing
  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Handle focus events separately with the correct event type
  const handleInputFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
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

  // Apply formatting to selected text with error handling
  const applyFormatting = (format: string, value: string) => {
    try {
      if (!selectedText || !textareaRef.current) {
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
      
      // Create formatting tag
      const formattedText = `<span class="${format}-${value}">${selection}</span>`;
      const newContent = beforeSelection + formattedText + afterSelection;
      
      handleFormattedContentChange(newContent);
      
      // Reset selection after applying format
      setTimeout(() => {
        if (textareaRef.current) {
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

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Formatted Content</h3>
      <div className="border rounded-md p-3 bg-gray-50">
        <TextFormattingToolbar 
          selectedText={selectedText}
          onFormatText={applyFormatting}
          onInputClick={handleInputClick}
        />
        
        <Textarea
          ref={textareaRef}
          className="w-full h-32 border rounded p-2 text-sm"
          value={component.formattedContent || ""}
          onChange={(e) => handleFormattedContentChange(e.target.value)}
          placeholder="Enter formatted content or use API fields..."
          onClick={handleInputClick}
          onFocus={handleInputFocus}
          onSelect={handleTextareaSelect}
        />
        
        <TextOptionsAccordion 
          component={component}
          onPropertyChange={handlePropertyChange}
          onInputClick={handleInputClick}
        />

        <ApiFieldsDisplay 
          component={component}
          onInputClick={handleInputClick}
          onAddPlaceholder={addApiPlaceholder}
        />
      </div>
    </div>
  );
};

export default FormattedTextEditor;
