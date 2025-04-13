
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
