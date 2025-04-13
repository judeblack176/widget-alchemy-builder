
import React from 'react';

export const multiTextRenderer = (finalProps: Record<string, any>) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{finalProps.label || "Multi-line Input"}</label>
      <textarea
        placeholder={finalProps.placeholder || "Type your text here..."}
        rows={finalProps.rows || 4}
        className="w-full px-3 py-2 border rounded"
        defaultValue={finalProps.content || ""}
      ></textarea>
      {finalProps.apiData && (
        <div className="mt-1 text-xs text-blue-600">
          <span className="bg-blue-50 px-2 py-0.5 rounded">API Connected</span>
        </div>
      )}
    </div>
  );
};
