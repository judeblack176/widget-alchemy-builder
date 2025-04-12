import React from 'react';
import { Alert as UIAlert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import * as RechartsPrimitive from "recharts";
import * as LucideIcons from "lucide-react";

// Dynamic icon renderer
const DynamicIcon = ({ icon, size = 20, className = "" }) => {
  if (!icon) return null;
  
  const IconComponent = LucideIcons[icon];
  if (!IconComponent) return null;
  
  return <IconComponent size={size} className={className} />;
};

// Basic component definitions
export const Header = ({ title, icon, actions }: any) => {
  return (
    <div className="bg-blue-500 text-white px-4 py-2.5 rounded-t-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon && <DynamicIcon icon={icon} className="text-white" />}
        <h3 className="text-base font-medium">{title}</h3>
      </div>
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.includes("Edit") && (
            <button className="p-1 rounded hover:bg-blue-600">
              <DynamicIcon icon="Pencil" size={16} />
            </button>
          )}
          {actions.includes("More") && (
            <button className="p-1 rounded hover:bg-blue-600">
              <DynamicIcon icon="MoreVertical" size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const Text = ({ content, fontSize, fontFamily, textAlign, isBold, isItalic, textColor, align, size, color, backgroundColor }: any) => {
  const textStyle = {
    fontFamily: fontFamily === 'default' ? 'inherit' : fontFamily,
    fontSize: size === 'small' ? '0.875rem' : 
             size === 'large' ? '1.25rem' : 
             fontSize === 'small' ? '0.875rem' : 
             fontSize === 'large' ? '1.25rem' : 
             fontSize === 'xlarge' ? '1.5rem' : '1rem',
    fontWeight: isBold ? 'bold' : 'normal',
    fontStyle: isItalic ? 'italic' : 'normal',
    color: color || textColor || 'inherit',
    textAlign: align || textAlign || 'left',
    backgroundColor: backgroundColor || 'transparent'
  };

  return <div className="text-foreground" style={textStyle}>{content}</div>;
};

export const Image = ({ source, altText, caption, width, height, borderRadius, objectFit }: any) => {
  const imageStyle = {
    width: width || '100%',
    height: height === 'small' ? '150px' : height === 'medium' ? '250px' : height === 'large' ? '350px' : 'auto',
    borderRadius: borderRadius === 'small' ? '4px' : borderRadius === 'medium' ? '8px' : borderRadius === 'large' ? '16px' : borderRadius === 'circle' ? '50%' : '0',
    objectFit: objectFit || 'cover'
  };

  return (
    <div className="w-full">
      <img src={source} alt={altText || ''} style={imageStyle} />
      {caption && <p className="text-sm text-gray-500 mt-1">{caption}</p>}
    </div>
  );
};

export { Button };

export const Video = ({ source, title, width, height, controls = true, autoplay = false, poster }: any) => {
  return (
    <div className="w-full">
      <video 
        src={source} 
        title={title} 
        width={width || '100%'} 
        height={height || 'auto'} 
        controls={controls} 
        autoPlay={autoplay}
        poster={poster}
        className="rounded-md"
      >
        Your browser does not support the video tag.
      </video>
      {title && <p className="text-sm text-gray-500 mt-1">{title}</p>}
    </div>
  );
};

export const Chart = ({ chartType, title, data, labels, legend, colors, height }: any) => {
  return (
    <div className="w-full p-4 border rounded-md">
      <h4 className="text-sm font-medium mb-2">{title || 'Chart'}</h4>
      <div style={{ height: height || '200px' }} className="bg-gray-100 rounded-md flex items-center justify-center">
        <ChartContainer config={{}}>
          {chartType === 'bar' ? (
            <RechartsPrimitive.BarChart data={data || []}>
              <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
              <RechartsPrimitive.XAxis dataKey="name" />
              <RechartsPrimitive.YAxis />
              <RechartsPrimitive.Tooltip />
              <RechartsPrimitive.Legend />
              <RechartsPrimitive.Bar dataKey="value" fill="#8884d8" />
            </RechartsPrimitive.BarChart>
          ) : chartType === 'line' ? (
            <RechartsPrimitive.LineChart data={data || []}>
              <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
              <RechartsPrimitive.XAxis dataKey="name" />
              <RechartsPrimitive.YAxis />
              <RechartsPrimitive.Tooltip />
              <RechartsPrimitive.Legend />
              <RechartsPrimitive.Line type="monotone" dataKey="value" stroke="#8884d8" />
            </RechartsPrimitive.LineChart>
          ) : chartType === 'pie' ? (
            <RechartsPrimitive.PieChart>
              <RechartsPrimitive.Pie 
                data={data || []} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={80} 
                fill="#8884d8" 
                label
              />
              <RechartsPrimitive.Tooltip />
            </RechartsPrimitive.PieChart>
          ) : (
            <div>Chart: {chartType || 'unknown'}</div>
          )}
        </ChartContainer>
      </div>
    </div>
  );
};

export const Form = ({ fields, submitText, onSubmit }: any) => {
  return (
    <div className="w-full p-2">
      <form className="space-y-3">
        {fields && fields.map((field: any, idx: number) => (
          <div key={idx} className="space-y-1">
            <label className="text-sm font-medium">{field.label}</label>
            <input 
              type={field.type || 'text'} 
              placeholder={field.placeholder} 
              className="w-full p-2 border rounded-md text-sm" 
            />
          </div>
        ))}
        <button className="bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm">
          {submitText || 'Submit'}
        </button>
      </form>
    </div>
  );
};

export const Calendar = ({ events }: any) => {
  return (
    <div className="w-full p-2 border rounded-md">
      <div className="text-sm font-medium mb-2">Calendar</div>
      <div className="text-xs">
        {events && events.length > 0 ? (
          <ul className="space-y-1">
            {events.map((event: any, idx: number) => (
              <li key={idx} className="p-1 border-l-2 border-blue-500 pl-2">
                {event.title} - {event.date}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No events</p>
        )}
      </div>
    </div>
  );
};

export const Dropdown = ({ label, placeholder, options, icon }: any) => {
  const optionsArray = Array.isArray(options) 
    ? options 
    : typeof options === 'string' 
      ? options.split(',').map(opt => opt.trim())
      : [];

  return (
    <div className="w-full">
      {label && (
        <label className="text-sm font-medium block mb-1 flex items-center gap-1">
          {icon && <DynamicIcon icon={icon} size={16} />}
          {label}
        </label>
      )}
      <select className="w-full p-2 border rounded-md text-sm bg-white">
        {placeholder && <option value="">{placeholder}</option>}
        {optionsArray.map((option: string, idx: number) => (
          <option key={idx} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export const Link = ({ text, url, openInNewTab, style, icon }: any) => {
  const linkStyle = {
    color: '#3B82F6',
    backgroundColor: style === 'button' ? '#EFF6FF' : 'transparent',
    padding: style === 'button' ? '6px 12px' : '0',
    borderRadius: style === 'button' ? '4px' : '0',
    textDecoration: style === 'underlined' ? 'underline' : 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  };

  return (
    <a 
      href={url} 
      target={openInNewTab === 'true' ? '_blank' : '_self'} 
      rel={openInNewTab === 'true' ? 'noopener noreferrer' : ''}
      style={linkStyle}
    >
      {icon && <DynamicIcon icon={icon} size={16} />}
      {text}
    </a>
  );
};

export const MultiText = ({ items }: any) => {
  const textItems = Array.isArray(items) ? items : [];
  
  return (
    <div className="space-y-2">
      {textItems.map((item, idx) => (
        <div key={idx} className="p-2 border rounded-md">
          {item.title && <div className="font-medium">{item.title}</div>}
          <div>{item.content}</div>
        </div>
      ))}
    </div>
  );
};

export const Filter = ({ options, onFilter }: any) => {
  const filterOptions = Array.isArray(options) 
    ? options 
    : typeof options === 'string' 
      ? options.split(',').map(opt => opt.trim())
      : [];

  return (
    <div className="flex flex-wrap gap-2 p-2">
      {filterOptions.map((option, idx) => (
        <button 
          key={idx} 
          className="px-3 py-1 border rounded-full text-xs hover:bg-gray-100"
          onClick={() => onFilter && onFilter(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export const Alert = ({ title, children, variant, onDismiss, icon }: any) => {
  return (
    <div className={`relative w-full rounded-lg border p-4 ${variant === 'destructive' ? 'border-destructive/50 text-destructive' : 'bg-background text-foreground'}`}>
      {title && (
        <h5 className="mb-1 font-medium flex items-center gap-1">
          {icon && <DynamicIcon icon={icon} size={16} />}
          {title}
        </h5>
      )}
      <div className="text-sm">{children}</div>
      {onDismiss && (
        <button 
          className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
          onClick={onDismiss}
        >
          &times;
        </button>
      )}
    </div>
  );
};

export const Table = ({ data, columns }: any) => {
  const tableData = Array.isArray(data) ? data : [];
  const tableColumns = Array.isArray(columns) ? columns : [];
  
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            {tableColumns.map((col, idx) => (
              <th key={idx} className="p-2 text-left border">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIdx) => (
            <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {tableColumns.map((col, colIdx) => (
                <td key={colIdx} className="p-2 border">{row[col.accessor]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const SearchBar = ({ placeholder, onSearch }: any) => {
  return (
    <div className="w-full">
      <input 
        type="text" 
        placeholder={placeholder || 'Search...'}
        className="w-full p-2 border rounded-md text-sm"
        onChange={(e) => onSearch && onSearch(e.target.value)}
      />
    </div>
  );
};
