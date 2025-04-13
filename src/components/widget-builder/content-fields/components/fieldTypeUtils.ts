
import { FileText, Database, Calendar, Hash, Table } from "lucide-react";
import React from "react";

/**
 * Determines field type and styling based on field name and API field
 */
export const getFieldTypeInfo = (fieldName: string, apiField: string) => {
  const lowerField = fieldName.toLowerCase();
  const lowerApiField = apiField.toLowerCase();
  
  // Check for date/time fields
  if (
    lowerField.includes('date') || 
    lowerField.includes('time') || 
    lowerApiField.includes('date') || 
    lowerApiField.includes('time')
  ) {
    return {
      icon: React.createElement(Calendar, { size: 12, className: "mr-1" }),
      bgClass: "bg-yellow-50 text-yellow-600 border-yellow-200"
    };
  }
  
  // Check for numeric fields
  if (
    lowerField.includes('count') || 
    lowerField.includes('number') || 
    lowerField.includes('amount') || 
    lowerField.includes('total') ||
    lowerField.includes('price') ||
    lowerField.includes('id')
  ) {
    return {
      icon: React.createElement(Hash, { size: 12, className: "mr-1" }),
      bgClass: "bg-purple-50 text-purple-600 border-purple-200"
    };
  }
  
  // Check for array/list fields
  if (
    apiField.includes('[') || 
    lowerField.includes('list') ||
    lowerField.includes('items') ||
    lowerField.includes('array')
  ) {
    return {
      icon: React.createElement(Table, { size: 12, className: "mr-1" }),
      bgClass: "bg-indigo-50 text-indigo-600 border-indigo-200"
    };
  }
  
  // Check for complex/object fields
  if (
    lowerField.includes('object') || 
    apiField.includes('.') ||
    lowerField.includes('data')
  ) {
    return {
      icon: React.createElement(Database, { size: 12, className: "mr-1" }),
      bgClass: "bg-blue-50 text-blue-600 border-blue-200"
    };
  }
  
  // Default for text/string fields
  return {
    icon: React.createElement(FileText, { size: 12, className: "mr-1" }),
    bgClass: "bg-green-50 text-green-600 border-green-200"
  };
};
