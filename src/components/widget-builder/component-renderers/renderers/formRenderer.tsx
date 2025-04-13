
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const formRenderer = (finalProps: Record<string, any>) => {
  const fieldType = finalProps.fieldType || "text";
  const placeholder = finalProps.placeholder || "Enter value...";
  const label = finalProps.label || "Input field";
  const required = finalProps.required || false;
  const disabled = finalProps.disabled || false;
  const className = finalProps.className || "";
  
  return (
    <div className="space-y-2">
      <Label htmlFor={`form-field-${label.toLowerCase().replace(/\s+/g, '-')}`} className="block text-sm font-medium">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={`form-field-${label.toLowerCase().replace(/\s+/g, '-')}`}
        type={fieldType}
        placeholder={placeholder}
        disabled={disabled}
        className={cn("w-full px-3 py-2 border rounded", className)}
      />
    </div>
  );
};
