
import React from "react";

/**
 * Handles selection in the textarea
 */
export const handleTextSelection = (
  e: React.SyntheticEvent<HTMLTextAreaElement | HTMLInputElement>,
  setSelectedText: React.Dispatch<React.SetStateAction<{start: number, end: number} | null>>
) => {
  const target = e.target as HTMLTextAreaElement | HTMLInputElement;
  if (target.selectionStart !== target.selectionEnd) {
    setSelectedText({
      start: target.selectionStart || 0,
      end: target.selectionEnd || 0
    });
  } else {
    setSelectedText(null);
  }
};

/**
 * Updates cursor position after applying formatting
 */
export const updateCursorPosition = (
  textareaRef: React.RefObject<HTMLTextAreaElement>,
  inputRef: React.RefObject<HTMLInputElement>,
  beforeSelectionLength: number,
  formattedTextLength: number
) => {
  setTimeout(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      const newCursorPos = beforeSelectionLength + formattedTextLength;
      inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
    } else if (textareaRef.current) {
      textareaRef.current.focus();
      const newCursorPos = beforeSelectionLength + formattedTextLength;
      textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
    }
  }, 0);
};
