
import React, { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { WidgetComponent } from "@/types/widget-types";
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

  // Apply formatting to selected text
  const applyFormatting = (format: string, value: string) => {
    if (!selectedText || !textareaRef.current) return;
    
    const content = component.formattedContent || "";
    const beforeSelection = content.substring(0, selectedText.start);
    const selection = content.substring(selectedText.start, selectedText.end);
    const afterSelection = content.substring(selectedText.end);
    
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
  };

  const addApiPlaceholder = (placeholder: string) => {
    const currentContent = component.formattedContent || "";
    handleFormattedContentChange(currentContent + placeholder);
  };

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
