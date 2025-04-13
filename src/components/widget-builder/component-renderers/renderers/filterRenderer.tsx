
import React from 'react';

export const filterRenderer = (finalProps: Record<string, any>) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{finalProps.label || "Filter"}</label>
      <div
        className="px-3 py-2 border rounded flex items-center"
        style={{
          backgroundColor: finalProps.backgroundColor || '#FFFFFF',
          color: finalProps.textColor || '#333333',
          borderColor: finalProps.borderColor || '#E2E8F0'
        }}
      >
        <input
          type="text"
          placeholder={finalProps.placeholder || "Filter items..."}
          className="w-full bg-transparent outline-none"
        />
      </div>
    </div>
  );
};
