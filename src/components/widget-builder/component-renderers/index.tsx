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
  Search,
  Library,
  Bell,
  Bookmark,
  FileText,
  User,
  Globe,
  Home,
  Mail,
  Map,
  Phone,
  ShoppingBag,
  Star,
  Coffee,
  X,
  HelpCircle,
  Download,
  Link as LinkIconComponent,
  Calendar,
  Code,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import SearchBar from '../SearchBar';
import { Tooltip as CustomTooltip } from '../TooltipManager';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

const getIconByName = (iconName: string) => {
  switch (iconName) {
    case 'BookOpen': return <BookOpen className="mr-4 flex-shrink-0" />;
    case 'Library': return <Library className="mr-4 flex-shrink-0" />;
    case 'Bell': return <Bell className="mr-4 flex-shrink-0" />;
    case 'Bookmark': return <Bookmark className="mr-4 flex-shrink-0" />;
    case 'FileText': return <FileText className="mr-4 flex-shrink-0" />;
    case 'User': return <User className="mr-4 flex-shrink-0" />;
    case 'Info': return <Info className="mr-4 flex-shrink-0" />;
    case 'Globe': return <Globe className="mr-4 flex-shrink-0" />;
    case 'Home': return <Home className="mr-4 flex-shrink-0" />;
    case 'Mail': return <Mail className="mr-4 flex-shrink-0" />;
    case 'Map': return <Map className="mr-4 flex-shrink-0" />;
    case 'Phone': return <Phone className="mr-4 flex-shrink-0" />;
    case 'ShoppingBag': return <ShoppingBag className="mr-4 flex-shrink-0" />;
    case 'Star': return <Star className="mr-4 flex-shrink-0" />;
    case 'Coffee': return <Coffee className="mr-4 flex-shrink-0" />;
    default: return <BookOpen className="mr-4 flex-shrink-0" />;
  }
};

const getLinkIcon = (iconName: string) => {
  switch (iconName) {
    case 'LinkIcon': return <LinkIconComponent size={16} className="mr-1" />;
    case 'ExternalLink': return <ExternalLink size={16} className="mr-1" />;
    case 'FileText': return <FileText size={16} className="mr-1" />;
    case 'Download': return <Download size={16} className="mr-1" />;
    case 'Info': return <Info size={16} className="mr-1" />;
    default: return null;
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

export const renderComponent = (
  component: WidgetComponent, 
  apiData?: any, 
  onDismiss?: (id: string) => void,
  tooltips?: CustomTooltip[]
) => {
  const { props, type, id, tooltipId } = component;
  
  if (!tooltipId) {
    return renderComponentWithoutTooltip(component, apiData, onDismiss);
  }
  
  const tooltipContent = getTooltipContent(tooltipId, tooltips);
  
  if (!tooltipContent) {
    return renderComponentWithoutTooltip(component, apiData, onDismiss);
  }
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="tooltip-trigger w-full">
          {renderComponentWithoutTooltip(component, apiData, onDismiss)}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-3">
        {tooltipContent}
      </HoverCardContent>
    </HoverCard>
  );
};

const getTooltipContent = (tooltipId: string, customTooltips?: CustomTooltip[]) => {
  switch (tooltipId) {
    case 'help':
      return (
        <div className="flex items-start gap-2">
          <HelpCircle size={16} className="text-blue-500 mt-0.5" />
          <span>Need help with this feature? Click for assistance.</span>
        </div>
      );
    case 'info':
      return (
        <div className="flex items-start gap-2">
          <Info size={16} className="text-green-500 mt-0.5" />
          <span>Additional information about this element.</span>
        </div>
      );
    case 'warning':
      return (
        <div className="flex items-start gap-2">
          <AlertTriangle size={16} className="text-amber-500 mt-0.5" />
          <span>Important warning about this element.</span>
        </div>
      );
    case 'tip':
      return (
        <div className="flex items-start gap-2">
          <Star size={16} className="text-purple-500 mt-0.5" />
          <span>Pro tip for using this feature effectively.</span>
        </div>
      );
    default:
      if (customTooltips) {
        const customTooltip = customTooltips.find(t => t.id === tooltipId);
        if (customTooltip) {
          return (
            <div>
              <p className="font-medium mb-1">{customTooltip.title}</p>
              <p className="text-sm">{customTooltip.content}</p>
            </div>
          );
        }
      }
      return null;
  }
};

const renderComponentWithoutTooltip = (component: WidgetComponent, apiData?: any, onDismiss?: (id: string) => void) => {
  const { props, type, id } = component;
  
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
          className="w-full p-3 sticky top-0 z-10"
          style={{
            backgroundColor: finalProps.backgroundColor || '#3B82F6',
            color: finalProps.textColor || '#FFFFFF',
            marginTop: 0,
            marginLeft: -16,
            marginRight: -16,
            width: 'calc(100% + 32px)',
          }}
        >
          <div className="flex items-center text-left pl-8">
            {getIconByName(finalProps.icon || 'BookOpen')}
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
      const heightStyles = finalProps.height === 'auto' ? {} : 
        finalProps.height === 'small' ? { height: '100px' } :
        finalProps.height === 'medium' ? { height: '200px' } :
        finalProps.height === 'large' ? { height: '400px' } : {};
      
      const borderRadiusStyles = finalProps.borderRadius === 'none' ? {} :
        finalProps.borderRadius === 'small' ? { borderRadius: '4px' } :
        finalProps.borderRadius === 'medium' ? { borderRadius: '8px' } :
        finalProps.borderRadius === 'large' ? { borderRadius: '16px' } :
        finalProps.borderRadius === 'circle' ? { borderRadius: '50%' } : {};
        
      const objectFitStyle = finalProps.objectFit || 'cover';
      
      return (
        <figure className="relative" style={{ width: finalProps.width || 'auto' }}>
          <img 
            src={finalProps.source || "https://via.placeholder.com/150"}
            alt={finalProps.altText || "Image"} 
            className="w-full"
            style={{
              ...heightStyles,
              ...borderRadiusStyles,
              objectFit: objectFitStyle
            }}
          />
          {finalProps.caption && (
            <figcaption className="text-sm text-gray-500 mt-1">{finalProps.caption}</figcaption>
          )}
        </figure>
      );
    
    case 'button':
      const handleButtonClick = () => {
        console.log('Button clicked', finalProps.label);
        if (finalProps.linkUrl) {
          const target = finalProps.openInNewTab ? '_blank' : '_self';
          window.open(finalProps.linkUrl, target);
        }
      };
      
      return (
        <Button
          variant={finalProps.variant || "default"}
          size={finalProps.size || "default"}
          className={finalProps.className}
          onClick={handleButtonClick}
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
      const chartTypeLabel = finalProps.chartType || 'bar';
      const hasData = finalProps.staticData || (finalProps.dataUrl && finalProps.dataSource !== 'static');
      
      return (
        <div className="p-3 border rounded" style={{ backgroundColor: finalProps.backgroundColor || '#FFFFFF' }}>
          {finalProps.title && <h3 className="text-center font-medium mb-3">{finalProps.title}</h3>}
          <div className="aspect-video bg-gray-100 flex flex-col items-center justify-center" style={{ height: finalProps.height ? `${finalProps.height}px` : '300px' }}>
            {hasData ? (
              <div className="text-center">
                <p className="text-gray-700 font-medium">{chartTypeLabel.charAt(0).toUpperCase() + chartTypeLabel.slice(1)} Chart</p>
                <p className="text-gray-500 text-sm mt-1">
                  {finalProps.dataSource === 'api' ? 'Data from API' : 
                   finalProps.dataSource === 'url' ? 'Data from URL' : 
                   'Static data'}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-500 text-sm">No data configured</p>
                <p className="text-gray-400 text-xs mt-2">Connect to a data source or provide static data</p>
              </div>
            )}
          </div>
          {finalProps.legend && (
            <div className={`flex justify-${finalProps.legendPosition || 'bottom'} mt-2 gap-2 flex-wrap`}>
              {(finalProps.labels || "Item 1,Item 2,Item 3").split(',').map((label, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 mr-1" 
                    style={{ 
                      backgroundColor: (finalProps.colors || "#3B82F6,#EF4444,#10B981,#F59E0B").split(',')[index % 4] 
                    }}
                  ></div>
                  <span className="text-xs">{label.trim()}</span>
                </div>
              ))}
            </div>
          )}
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
          {finalProps.label && (
            <label className="block text-sm font-medium">{finalProps.label}</label>
          )}
          
          {finalProps.calendarType === 'date-picker' ? (
            <div className="border rounded p-4">
              <CalendarComponent
                mode="single"
                className="rounded-md border"
              />
            </div>
          ) : (
            <div className="border rounded p-4">
              <div className="flex items-center justify-between mb-4">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
                </Button>
                <h3 className="font-medium">
                  {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <Button variant="outline" size="sm">
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="text-center text-xs text-gray-500 py-1">{day}</div>
                ))}
                {Array.from({ length: 35 }).map((_, i) => {
                  const day = i - 3 + 1; // Adjust to start from Monday of the first week
                  return (
                    <div 
                      key={i} 
                      className={`text-center text-sm p-2 rounded-full ${
                        day > 0 && day <= 30 ? "hover:bg-gray-100 cursor-pointer" : "opacity-0"
                      } ${day === 15 ? "bg-blue-100 text-blue-700" : ""}`}
                    >
                      {day > 0 && day <= 30 ? day : ""}
                    </div>
                  );
                })}
              </div>
              
              {finalProps.calendarProvider && finalProps.calendarProvider !== 'none' && (
                <div className="mt-3 text-xs text-gray-500 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Connected to {finalProps.calendarProvider} Calendar
                </div>
              )}
            </div>
          )}
        </div>
      );
    
    case 'dropdown':
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
    
    case 'link':
      const openInNewTab = finalProps.openInNewTab === true;
      const displayType = finalProps.displayType || 'text';
      const icon = displayType !== 'text' ? getLinkIcon(finalProps.icon || 'LinkIcon') : null;
      
      return (
        <div className="inline-flex items-center">
          <a
            href={finalProps.url || "#"}
            target={openInNewTab ? "_blank" : "_self"}
            rel={openInNewTab ? "noopener noreferrer" : ""}
            className={finalProps.style === 'button' ? 'px-3 py-1.5 rounded hover:bg-opacity-90 flex items-center' : 
                       finalProps.style === 'underlined' ? 'underline hover:text-opacity-80 flex items-center' : 
                       'hover:text-opacity-80 flex items-center'}
            style={{
              backgroundColor: finalProps.style === 'button' ? (finalProps.backgroundColor || '#3B82F6') : 'transparent',
              color: finalProps.color || (finalProps.style === 'button' ? '#FFFFFF' : '#3B82F6')
            }}
          >
            {(displayType === 'icon' || displayType === 'both') && icon}
            {(displayType === 'text' || displayType === 'both') && (finalProps.text || "Link")}
            {openInNewTab && displayType === 'text' && <ExternalLink size={14} className="ml-1" />}
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
      const isDismissible = finalProps.dismissible !== false;
      
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
          <div className="flex-grow">
            <AlertTitle>{finalProps.title || "Alert"}</AlertTitle>
            <AlertDescription>{finalProps.message || "This is an alert message."}</AlertDescription>
          </div>
          {isDismissible && onDismiss && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-6 w-6 rounded-full"
              onClick={() => onDismiss(id)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          )}
        </Alert>
      );
    
    case 'table':
      const isPaginated = finalProps.pagination === true;
      const isSearchable = finalProps.searchable === true;
      const isSortable = finalProps.sortable === true;
      const isExportable = finalProps.exportable === true;
      
      return (
        <Card>
          <CardContent className="p-0">
            {(isSearchable || isExportable) && (
              <div className="p-3 border-b flex justify-between items-center">
                {isSearchable && (
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      className="pl-9 pr-4 py-1 w-full border rounded text-sm"
                      placeholder="Search..."
                    />
                  </div>
                )}
                {isExportable && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText size={16} className="mr-1" />
                      Export
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            <div className="border rounded overflow-hidden" style={{ borderColor: finalProps.borderColor || '#E2E8F0' }}>
              <Table>
                <thead style={{ 
                  backgroundColor: finalProps.headerBackgroundColor || '#F8FAFC',
                  color: finalProps.headerTextColor || '#334155' 
                }}>
                  <tr>
                    {Array.isArray(finalProps.columns) ? 
                      finalProps.columns.map((column: TableColumn, index: number) => (
                        <th key={index} className="p-2 text-left">
                          <div className="flex items-center">
                            {column.header}
                            {isSortable && (
                              <button className="ml-1 text-gray-400 hover:text-gray-600">
                                <ArrowUpDown size={14} />
                              </button>
                            )}
                          </div>
                        </th>
                      )) : 
                      (
                        <>
                          <th className="p-2 text-left">Name</th>
                          <th className="p-2 text-left">Age</th>
                          <th className="p-2 text-left">Status</th>
                        </>
                      )
                    }
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(finalProps.data) ? 
                    finalProps.data.map((row: any, rowIndex: number) => (
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
                    )) : 
                    (
                      <>
                        <tr className={finalProps.hoverable ? 'hover:bg-gray-50' : ''}>
                          <td className={`p-2 ${finalProps.bordered ? 'border' : 'border-b'}`}>John Doe</td>
                          <td className={`p-2 ${finalProps.bordered ? 'border' : 'border-b'}`}>28</td>
                          <td className={`p-2 ${finalProps.bordered ? 'border' : 'border-b'}`}>Active</td>
                        </tr>
                        <tr className={`${finalProps.striped ? 'bg-gray-50' : ''} ${finalProps.hoverable ? 'hover:bg-gray-100' : ''}`}>
                          <td className={`p-2 ${finalProps.bordered ? 'border' : 'border-b'}`}>Jane Smith</td>
                          <td className={`p-2 ${finalProps.bordered ? 'border' : 'border-b'}`}>32</td>
                          <td className={`p-2 ${finalProps.bordered ? 'border' : 'border-b'}`}>Inactive</td>
                        </tr>
                      </>
                    )
                  }
                </tbody>
              </Table>
            </div>
            
            {isPaginated && (
              <div className="p-3 border-t flex justify-between items-center text-sm">
                <div>
                  Showing 1-{finalProps.pageSize || 10} of 100 items
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm" className="bg-gray-100">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      );
      
    case 'searchbar':
      return (
        <SearchBar
          placeholder={finalProps.placeholder || "Search..."}
          onSearch={(query) => {
            console.log('Search for:', query);
            console.log('Search target:', finalProps.searchTarget);
            console.log('Target component:', finalProps.targetComponent);
          }}
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
    
    case 'code':
      return (
        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Code size={16} className="mr-2 text-blue-500" />
              <span className="font-medium">{finalProps.title || "Custom Code"}</span>
            </div>
            {finalProps.language && (
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{finalProps.language}</span>
            )}
          </div>
          <div className="relative">
            <pre 
              className="p-4 rounded-md text-sm font-mono overflow-x-auto"
              style={{
                backgroundColor: finalProps.darkMode ? '#1e1e1e' : '#f8f8f8',
                color: finalProps.darkMode ? '#d4d4d4' : '#333333',
                maxHeight: finalProps.maxHeight || '300px',
                border: `1px solid ${finalProps.darkMode ? '#2d2d2d' : '#e2e2e2'}`
              }}
            >
              <code>{finalProps.content || "// Add your custom code here"}</code>
            </pre>
            {finalProps.executionEnabled && (
              <div className="mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  onClick={() => {
                    try {
                      const executeCode = new Function(`
                        try {
                          ${finalProps.content || ''}
                          return { success: true, result: 'Code executed successfully' };
                        } catch (error) {
                          return { success: false, error: error.toString() };
                        }
                      `);
                      
                      const result = executeCode();
                      console.log('Code execution result:', result);
                      
                      if (finalProps.onExecute && typeof window[finalProps.onExecute] === 'function') {
                        window[finalProps.onExecute](result);
                      }
                    } catch (error) {
                      console.error('Failed to execute code:', error);
                    }
                  }}
                >
                  <Code size={14} />
                  Execute
                </Button>
              </div>
            )}
          </div>
          {finalProps.description && (
            <p className="mt-2 text-sm text-gray-500">{finalProps.description}</p>
          )}
        </div>
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

const ChevronDown = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const ChevronLeft = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

const ChevronRight = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

const ArrowUpDown = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m21 16-4 4-4-4"/>
    <path d="M17 20V4"/>
    <path d="m3 8 4-4 4 4"/>
    <path d="M7 4v16"/>
  </svg>
);
