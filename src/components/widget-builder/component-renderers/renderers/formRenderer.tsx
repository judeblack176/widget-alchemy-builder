
import React from 'react';

export const formRenderer = (finalProps: Record<string, any>) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{finalProps.label || "Input field"}</label>
      <input
        type={finalProps.fieldType || "text"}
        placeholder={finalProps.placeholder || "Enter value..."}
        className="w-full px-3 py-2 border rounded"
      />
    </div>
  );
};
