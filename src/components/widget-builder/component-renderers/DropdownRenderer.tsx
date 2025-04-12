
import React from 'react';
import { WidgetComponent } from '@/types';
import { Search } from 'lucide-react';
import { ChevronDown } from './icons';

interface DropdownRendererProps {
  component: WidgetComponent;
  finalProps: Record<string, any>;
}

const DropdownRenderer: React.FC<DropdownRendererProps> = ({ component, finalProps }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{finalProps.label || "Dropdown"}</label>
      <div className={`relative border rounded overflow-hidden ${finalProps.searchable ? 'flex items-center' : ''}`}>
        {finalProps.searchable && (
          <Search size={16} className="absolute left-3 text-gray-400" />
        )}
        <select 
          className={`w-full px-3 py-2 appearance-none ${finalProps.searchable ? 'pl-9' : ''}`}
          multiple={finalProps.multiple}
          required={finalProps.required}
        >
          <option value="" disabled selected>{finalProps.placeholder || "Select an option"}</option>
          {Array.isArray(finalProps.options) ? 
            finalProps.options.map((option: string, index: number) => (
              <option key={index} value={option}>{option}</option>
            )) : 
            (finalProps.options || "Option 1,Option 2,Option 3").split(',').map((option, index) => (
              <option key={index} value={option.trim()}>{option.trim()}</option>
            ))
          }
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
      {finalProps.dynamicOptions && finalProps.optionsUrl && (
        <p className="text-xs text-gray-500">Options dynamically loaded from API</p>
      )}
    </div>
  );
};

export default DropdownRenderer;
