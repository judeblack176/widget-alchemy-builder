
import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import ApiFieldsDisplay from "./ApiFieldsDisplay";
import { useTextFormatting } from "./hooks/useTextFormatting";
import FormattingToolbar from "./components/FormattingToolbar";
import HeaderFormattingToolbar from "./components/HeaderFormattingToolbar";
import TextInput from "./components/TextInput";

interface FormattedTextEditorProps {
  component: WidgetComponent;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  singleLine?: boolean;
}

const FormattedTextEditor: React.FC<FormattedTextEditorProps> = ({
  component,
  onUpdateComponent,
  singleLine = false
}) => {
  const {
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
  } = useTextFormatting(component, onUpdateComponent);

  // Determine if we're rendering a header component
  const isHeader = component.type === 'header';

  // Process the formatted content for display in the editor
  // This removes HTML tags so user doesn't see them while editing
  const processFormattedContent = (content: string) => {
    if (!content) return '';
    
    // First handle all the specific tag formats we support
    let processedContent = content
      .replace(/<strong>(.*?)<\/strong>/g, '$1')
      .replace(/<em>(.*?)<\/em>/g, '$1')
      .replace(/<span class="align-left">(.*?)<\/span>/g, '$1')
      .replace(/<span class="align-center">(.*?)<\/span>/g, '$1')
      .replace(/<span class="align-right">(.*?)<\/span>/g, '$1')
      .replace(/<span class="color-[^"]*">(.*?)<\/span>/g, '$1')
      .replace(/<span class="background-color-[^"]*">(.*?)<\/span>/g, '$1')
      .replace(/<span class="size-[^"]*">(.*?)<\/span>/g, '$1');
    
    // Handle any other HTML tag that might have been added
    // This ensures we catch ALL tags, even ones not explicitly handled above
    processedContent = processedContent.replace(/<[^>]*>(.*?)<\/[^>]*>/g, '$1');
    
    return processedContent;
  };

  // Process visible content (what user sees in the editor)
  const visibleContent = processFormattedContent(component.formattedContent || "");

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Formatted Content</h3>
      <div className="border rounded-md p-3 bg-gray-50">
        {isHeader ? (
          <HeaderFormattingToolbar 
            selectedText={selectedText}
            onFormatText={applyFormatting}
            onInputClick={handleInputClick}
          />
        ) : (
          <FormattingToolbar 
            selectedText={selectedText}
            onFormatText={applyFormatting}
            onInputClick={handleInputClick}
          />
        )}
        
        <TextInput 
          singleLine={singleLine}
          value={component.formattedContent || ""}
          onChange={handleFormattedContentChange}
          inputRef={inputRef}
          textareaRef={textareaRef}
          onInputClick={handleInputClick}
          onFocus={handleInputFocus}
          onSelect={singleLine ? handleSingleLineSelect : handleTextareaSelect}
          visibleValue={visibleContent} // Pass clean content without HTML tags
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
