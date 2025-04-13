
import React from "react";

/**
 * Stops propagation on input interactions to prevent container from closing
 */
export const handleInputClick = (e: React.MouseEvent) => {
  e.stopPropagation();
};

/**
 * Handle focus events
 */
export const handleInputFocus = (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
  e.stopPropagation();
};
