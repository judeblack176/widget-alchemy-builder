
import React from "react";

interface TextInputProps {
  singleLine: boolean;
  value: string;
  onChange: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onInputClick: (e: React.MouseEvent) => void;
  onFocus: (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onSelect: (e: React.SyntheticEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  visibleValue?: string; // New prop for displaying clean content
}

const TextInput: React.FC<TextInputProps> = ({
  singleLine,
  value,
  onChange,
  inputRef,
  textareaRef,
  onInputClick,
  onFocus,
  onSelect,
  visibleValue
}) => {
  // Use visibleValue for display if provided, otherwise use the raw value
  const displayValue = visibleValue !== undefined ? visibleValue : value;

  // We maintain the actual HTML in 'value' for the component state
  // but show the user the cleaner 'displayValue'
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return singleLine ? (
    <div className="mt-2">
      <input
        ref={inputRef}
        type="text"
        className="w-full h-10 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={displayValue}
        onChange={handleChange}
        onClick={onInputClick}
        onFocus={onFocus}
        onSelect={onSelect as any}
      />
    </div>
  ) : (
    <div className="mt-2">
      <textarea
        ref={textareaRef}
        className="w-full h-32 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        value={displayValue}
        onChange={handleChange}
        onClick={onInputClick}
        onFocus={onFocus}
        onSelect={onSelect as any}
      />
    </div>
  );
};

export default TextInput;
