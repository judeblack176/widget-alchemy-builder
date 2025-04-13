
import React from 'react';

export const multiTextRenderer = (finalProps: Record<string, any>) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{finalProps.label || "Multi-line Input"}</label>
      <textarea
        placeholder={finalProps.placeholder || "Type your text here..."}
        rows={finalProps.rows || 4}
        className="w-full px-3 py-2 border rounded"
      ></textarea>
    </div>
  );
};
