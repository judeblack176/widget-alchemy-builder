
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TextInputProps {
  singleLine: boolean;
  value: string;
  onChange: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onInputClick: (e: React.MouseEvent) => void;
  onFocus: (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onSelect: (e: React.SyntheticEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
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
}) => {
  if (singleLine) {
    return (
      <Input
        ref={inputRef}
        className="w-full border rounded p-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter header text..."
        onClick={onInputClick}
        onFocus={onFocus}
        onSelect={onSelect as React.FormEventHandler<HTMLInputElement>}
      />
    );
  }

  return (
    <Textarea
      ref={textareaRef}
      className="w-full h-32 border rounded p-2 text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter formatted content or use API fields..."
      onClick={onInputClick}
      onFocus={onFocus}
      onSelect={onSelect as React.FormEventHandler<HTMLTextAreaElement>}
    />
  );
};

export default TextInput;
