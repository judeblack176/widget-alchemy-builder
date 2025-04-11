
import React from 'react';
import { WidgetComponent, AlertType, TableColumn } from '@/types/widget-types';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  AlertCircle,
  ExternalLink,
  Search 
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import SearchBar from '../SearchBar';

export const renderComponent = (component: WidgetComponent, apiData?: any) => {
  const { props, type } = component;
  
  let finalProps = { ...props };
  if (component.apiConfig && apiData) {
    const { dataMapping } = component.apiConfig;
    
    Object.entries(dataMapping).forEach(([propKey, apiField]) => {
      const value = getNestedValue(apiData, apiField);
      if (value !== undefined) {
        finalProps[propKey] = value;
      }
    });
  }
  
  return renderComponentWithoutTooltip(component, apiData);
};

const renderComponentWithoutTooltip = (component: WidgetComponent, apiData?: any) => {
  const { props, type } = component;
  
  let finalProps = { ...props };
  if (component.apiConfig && apiData) {
    const { dataMapping } = component.apiConfig;
    
    Object.entries(dataMapping).forEach(([propKey, apiField]) => {
      const value = getNestedValue(apiData, apiField);
      if (value !== undefined) {
        finalProps[propKey] = value;
      }
    });
  }
  
  switch (type) {
    case 'header':
      return (
        <div 
          className="w-full p-3"
          style={{
            backgroundColor: finalProps.backgroundColor || '#3B82F6',
            color: finalProps.textColor || '#FFFFFF',
            marginTop: 0,
            marginLeft: -16,
            marginRight: -16,
            width: 'calc(100% + 32px)',
          }}
        >
          <div className="flex items-center text-left">
            <BookOpen className="mr-2 flex-shrink-0" />
            <h2 
              className="text-left"
              style={{
                fontFamily: finalProps.fontFamily || 'system-ui',
                fontWeight: finalProps.bold ? 'bold' : 'normal',
                fontStyle: finalProps.italic ? 'italic' : 'normal'
              }}
            >
              {finalProps.title || "Header"}
            </h2>
          </div>
        </div>
      );
    
    case 'text':
      return (
        <div 
          className="p-3 rounded"
          style={{
            backgroundColor: finalProps.backgroundColor || 'transparent',
            color: finalProps.color || '#333333',
          }}
        >
          <p 
            style={{
              fontSize: finalProps.size === 'small' ? '0.875rem' : finalProps.size === 'large' ? '1.25rem' : '1rem',
              fontFamily: finalProps.fontFamily || 'system-ui',
              fontWeight: finalProps.bold ? 'bold' : 'normal',
              fontStyle: finalProps.italic ? 'italic' : 'normal'
            }}
          >
            {finalProps.content || "Text content"}
          </p>
        </div>
      );
    
    case 'image':
      return (
        <figure className="relative">
          <img 
            src={finalProps.source || "https://via.placeholder.com/150"} 
            alt={finalProps.altText || "Image"} 
            className="w-full h-auto rounded"
          />
          {finalProps.caption && (
            <figcaption className="text-sm text-gray-500 mt-1">{finalProps.caption}</figcaption>
          )}
        </figure>
      );
    
    case 'button':
      return (
        <Button
          variant={finalProps.variant || "default"}
          size={finalProps.size || "default"}
          className={finalProps.className}
          onClick={() => console.log('Button clicked', finalProps.label)}
          style={{
            backgroundColor: finalProps.backgroundColor || '#3B82F6',
            color: finalProps.textColor || '#FFFFFF',
          }}
        >
          {finalProps.label || "Button"}
        </Button>
      );
    
    case 'video':
      return (
        <div className="rounded overflow-hidden">
          <video
            src={finalProps.source}
            controls={finalProps.controls !== false}
            autoPlay={finalProps.autoplay === true}
            className="w-full"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    
    case 'chart':
      return (
        <div className="p-3 border rounded" style={{ backgroundColor: finalProps.backgroundColor || '#FFFFFF' }}>
          <p className="text-center mb-2">Chart Component: {finalProps.type || 'bar'}</p>
          <div className="aspect-video bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Chart visualization would appear here</p>
          </div>
        </div>
      );
    
    case 'form':
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
    
    case 'calendar':
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium">{finalProps.label || "Select Date"}</label>
          <input
            type="date"
            placeholder={finalProps.placeholder || "Pick a date"}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      );
    
    case 'dropdown':
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium">{finalProps.label || "Dropdown"}</label>
          <select className="w-full px-3 py-2 border rounded">
            <option value="" disabled selected>{finalProps.placeholder || "Select an option"}</option>
            {Array.isArray(finalProps.options) && finalProps.options.map((option: string, index: number) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>
      );
    
    case 'link':
      const openInNewTab = finalProps.openInNewTab === true;
      
      return (
        <div className="inline-flex items-center">
          <a
            href={finalProps.url || "#"}
            target={openInNewTab ? "_blank" : "_self"}
            rel={openInNewTab ? "noopener noreferrer" : ""}
            className={finalProps.style === 'button' ? 'px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600' : 
                       finalProps.style === 'underlined' ? 'text-blue-500 underline hover:text-blue-700' : 
                       'text-blue-500 hover:text-blue-700'}
          >
            {finalProps.text || "Link"}
            {openInNewTab && <ExternalLink size={14} className="ml-1" />}
          </a>
        </div>
      );
    
    case 'multi-text':
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
    
    case 'filter':
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
    
    case 'alert':
      const alertType = finalProps.type as AlertType || 'info';
      
      return (
        <Alert
          variant="default"
          style={{
            backgroundColor: finalProps.backgroundColor || '#EFF6FF',
            color: finalProps.textColor || '#1E3A8A',
            borderColor: finalProps.borderColor || '#BFDBFE'
          }}
        >
          {finalProps.icon !== false && (
            <div className="mr-2">
              {alertType === 'info' && <Info className="h-4 w-4" />}
              {alertType === 'success' && <CheckCircle className="h-4 w-4" />}
              {alertType === 'warning' && <AlertTriangle className="h-4 w-4" />}
              {alertType === 'error' && <AlertCircle className="h-4 w-4" />}
            </div>
          )}
          <div>
            <AlertTitle>{finalProps.title || "Alert"}</AlertTitle>
            <AlertDescription>{finalProps.message || "This is an alert message."}</AlertDescription>
          </div>
        </Alert>
      );
    
    case 'table':
      return (
        <Card>
          <CardContent className="p-0">
            <div className="border rounded overflow-hidden" style={{ borderColor: finalProps.borderColor || '#E2E8F0' }}>
              <Table>
                <thead style={{ 
                  backgroundColor: finalProps.headerBackgroundColor || '#F8FAFC',
                  color: finalProps.headerTextColor || '#334155' 
                }}>
                  <tr>
                    {Array.isArray(finalProps.columns) && finalProps.columns.map((column: TableColumn, index: number) => (
                      <th key={index} className="p-2 text-left">{column.header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(finalProps.data) && finalProps.data.map((row: any, rowIndex: number) => (
                    <tr 
                      key={rowIndex}
                      style={{ 
                        backgroundColor: finalProps.striped && rowIndex % 2 !== 0 ? 
                          (finalProps.altRowBackgroundColor || '#F1F5F9') : 
                          (finalProps.rowBackgroundColor || '#FFFFFF'),
                        color: finalProps.rowTextColor || '#1E293B'
                      }}
                      className={finalProps.hoverable ? 'hover:bg-gray-50' : ''}
                    >
                      {Array.isArray(finalProps.columns) && finalProps.columns.map((column: TableColumn, colIndex: number) => (
                        <td key={colIndex} className={`p-2 ${finalProps.bordered ? 'border' : 'border-b'}`}>
                          {row[column.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </CardContent>
        </Card>
      );
      
    case 'searchbar':
      return (
        <SearchBar
          placeholder={finalProps.placeholder || "Search..."}
          onSearch={(query) => console.log('Search for:', query)}
          iconColor={finalProps.iconColor}
          backgroundColor={finalProps.backgroundColor}
          textColor={finalProps.textColor}
          borderColor={finalProps.borderColor}
          showIcon={finalProps.showIcon !== 'false'}
          className={finalProps.width === 'small' ? 'w-64' : 
                   finalProps.width === 'medium' ? 'w-96' : 
                   'w-full'}
        />
      );
    
    default:
      console.error(`Unsupported component type: ${type}`);
      return (
        <div className="p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-500">Unsupported component type: {type}</p>
        </div>
      );
  }
};

const getNestedValue = (obj: any, path: string): any => {
  if (!obj || !path) return undefined;
  
  const parts = path.split(/\.|\[|\]/).filter(Boolean);
  let current = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    
    const index = /^\d+$/.test(part) ? parseInt(part, 10) : part;
    current = current[index];
  }
  
  return current;
};
