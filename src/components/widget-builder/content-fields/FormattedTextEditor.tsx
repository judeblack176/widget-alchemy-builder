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
  customLabel?: string; // Optional custom label
}

const FormattedTextEditor: React.FC<FormattedTextEditorProps> = ({
  component,
  onUpdateComponent,
  singleLine = false,
  customLabel
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

  const isHeader = component.type === 'header';

  const processFormattedContent = (content: string) => {
    if (!content) return '';
    
    let processedContent = content
      .replace(/<strong>(.*?)<\/strong>/g, '$1')
      .replace(/<em>(.*?)<\/em>/g, '$1')
      .replace(/<span class="align-left">(.*?)<\/span>/g, '$1')
      .replace(/<span class="align-center">(.*?)<\/span>/g, '$1')
      .replace(/<span class="align-right">(.*?)<\/span>/g, '$1')
      .replace(/<span class="color-[^"]*">(.*?)<\/span>/g, '$1')
      .replace(/<span class="background-color-[^"]*">(.*?)<\/span>/g, '$1')
      .replace(/<span class="size-[^"]*">(.*?)<\/span>/g, '$1');
    
    processedContent = processedContent.replace(/<[^>]*>(.*?)<\/[^>]*>/g, '$1');
    
    return processedContent;
  };

  const visibleContent = processFormattedContent(component.formattedContent || "");

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">{customLabel || "Formatted Content"}</h3>
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
          visibleValue={visibleContent}
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
