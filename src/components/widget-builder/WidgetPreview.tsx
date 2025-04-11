import React, { useState } from "react";
import { WidgetComponent, ApiConfig, CalendarServiceType, AlertType, TableColumn } from "@/types/widget-types";
import { 
  BookOpen, 
  Type, 
  Image, 
  Video, 
  BarChart, 
  FormInput, 
  MousePointer,
  Edit,
  MoreHorizontal,
  CalendarDays,
  List,
  Link as LinkIcon,
  Text,
  Calendar as CalendarIcon,
  UploadCloud,
  Upload,
  Download,
  RefreshCw,
  Bold,
  Italic,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  X,
  Table2
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface WidgetPreviewProps {
  components: WidgetComponent[];
  apis: ApiConfig[];
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ components, apis }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const dismissAlert = (id: string) => {
    setDismissedAlerts([...dismissedAlerts, id]);
  };

  const renderComponent = (component: WidgetComponent) => {
    switch (component.type) {
      case "header":
        return (
          <div 
            className="p-3 flex justify-between items-center rounded-t-md"
            style={{ 
              backgroundColor: component.props.backgroundColor || "#3B82F6", 
              color: component.props.textColor || "#FFFFFF",
              fontFamily: component.props.fontFamily || "system-ui",
              fontWeight: component.props.bold ? "bold" : "normal",
              fontStyle: component.props.italic ? "italic" : "normal"
            }}
          >
            <div className="flex items-center">
              {component.props.icon === "BookOpen" && <BookOpen size={18} className="mr-2" />}
              {component.props.icon === "Type" && <Type size={18} className="mr-2" />}
              {component.props.icon === "Image" && <Image size={18} className="mr-2" />}
              {component.props.icon === "Video" && <Video size={18} className="mr-2" />}
              {component.props.icon === "BarChart" && <BarChart size={18} className="mr-2" />}
              {component.props.icon === "FormInput" && <FormInput size={18} className="mr-2" />}
              <span className="font-medium">{component.props.title}</span>
            </div>
            <div className="flex space-x-1">
              {component.props.actions?.includes("Edit") && (
                <button className="p-1 hover:opacity-80 rounded">
                  <Edit size={16} />
                </button>
              )}
              {component.props.actions?.includes("More") && (
                <button className="p-1 hover:opacity-80 rounded">
                  <MoreHorizontal size={16} />
                </button>
              )}
            </div>
          </div>
        );
      
      case "text":
        return (
          <div 
            className="p-3" 
            style={{ 
              fontSize: component.props.size === "small" ? "0.875rem" : 
                      component.props.size === "large" ? "1.25rem" : "1rem",
              color: component.props.color || "#333333",
              backgroundColor: component.props.backgroundColor || "transparent",
              fontWeight: component.props.bold ? "bold" : (component.props.fontWeight || "normal"),
              fontStyle: component.props.italic ? "italic" : "normal",
              fontFamily: component.props.fontFamily || "system-ui"
            }}
          >
            {component.props.content}
          </div>
        );
      
      case "image":
        return (
          <div className="p-3">
            <img 
              src={component.props.source} 
              alt={component.props.altText || "Widget image"} 
              className="w-full h-auto rounded-md"
            />
            {component.props.caption && (
              <p className="mt-1 text-sm text-gray-500 text-center">{component.props.caption}</p>
            )}
          </div>
        );
      
      case "button":
        return (
          <div className="p-3">
            <button 
              className="px-4 py-2 rounded transition-colors w-full flex items-center justify-center"
              style={{ 
                backgroundColor: component.props.backgroundColor || "#3B82F6",
                color: component.props.textColor || "#FFFFFF",
                border: component.props.style === "outline" ? "1px solid" : "none",
                borderColor: component.props.style === "outline" ? (component.props.backgroundColor || "#3B82F6") : "transparent"
              }}
            >
              <MousePointer size={16} className="mr-2" />
              {component.props.label}
            </button>
          </div>
        );
      
      case "video":
        return (
          <div className="p-3">
            <div className="bg-black aspect-video rounded-md flex items-center justify-center">
              <Video size={32} className="text-white" />
              <span className="ml-2 text-white">Video Player</span>
            </div>
          </div>
        );
      
      case "chart":
        return (
          <div className="p-3">
            <div 
              className="rounded-md p-3 h-[150px] flex items-center justify-center"
              style={{
                backgroundColor: component.props.backgroundColor || "#F8FAFC",
                border: "1px solid",
                borderColor: component.props.borderColor || "#E2E8F0"
              }}
            >
              <BarChart size={24} className="mr-2" style={{ color: component.props.colors?.[0] || "#3B82F6" }} />
              <span style={{ color: component.props.textColor || "#1E293B" }}>
                {component.props.type.charAt(0).toUpperCase() + component.props.type.slice(1)} Chart
              </span>
            </div>
          </div>
        );
      
      case "form":
        return (
          <div className="p-3">
            <label className="block text-sm font-medium mb-1">
              {component.props.label}
            </label>
            {component.props.fieldType === "textarea" ? (
              <textarea 
                className="w-full p-2 border rounded-md" 
                placeholder={component.props.placeholder}
              />
            ) : component.props.fieldType === "select" ? (
              <select className="w-full p-2 border rounded-md">
                <option>Select an option...</option>
              </select>
            ) : (
              <input 
                type={component.props.fieldType} 
                className="w-full p-2 border rounded-md" 
                placeholder={component.props.placeholder}
              />
            )}
          </div>
        );

      case "calendar": {
        const allowExternalSync = component.props.allowExternalSync === true;
        const serviceType = component.props.calendarIntegration?.serviceType || 'none';
        const icsConfig = component.props.icsConfig || { enabled: false };
        
        const getCalendarServiceIcon = (type: string) => {
          switch (type) {
            case 'google':
              return <div className="text-red-500">G</div>;
            case 'outlook':
              return <div className="text-blue-500">O</div>;
            case 'apple':
              return <div className="text-gray-500">A</div>;
            case 'custom':
              return <div className="text-purple-500">C</div>;
            default:
              return null;
          }
        };
        
        return (
          <div className="p-3">
            <label className="block text-sm font-medium mb-1">
              {component.props.label}
              {serviceType !== 'none' && (
                <span className="ml-2 text-xs inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded">
                  {getCalendarServiceIcon(serviceType)}
                  <span className="ml-1 capitalize">{serviceType}</span>
                </span>
              )}
              {icsConfig.enabled && (
                <span className="ml-2 text-xs inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded">
                  ICS
                </span>
              )}
            </label>
            
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative cursor-pointer">
                  <div className="flex items-center w-full p-2 border rounded-md bg-white">
                    <CalendarDays size={16} className="mr-2 text-gray-500" />
                    <span className="text-gray-500">{component.props.placeholder}</span>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="p-2">
                  <Calendar 
                    calendarService={serviceType as any}
                    icsConfig={icsConfig}
                    onImportICS={(file) => console.log('Import ICS file:', file.name)}
                    onExportICS={() => console.log('Export calendar as ICS')}
                    onSubscribeICS={(url) => console.log('Subscribe to ICS URL:', url)}
                  />
                  
                  {serviceType === 'none' && allowExternalSync && (
                    <div className="mt-2 border-t pt-2">
                      <p className="text-xs text-gray-500 mb-2">Connect to external calendar</p>
                      <div className="flex flex-wrap gap-1">
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          <div className="mr-1 text-red-500 font-bold">G</div> Google
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          <div className="mr-1 text-blue-500 font-bold">O</div> Outlook
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          <div className="mr-1 text-gray-500 font-bold">A</div> Apple
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            
            {icsConfig.enabled && (
              <div className="mt-2 flex flex-wrap gap-1">
                {icsConfig.importEnabled && (
                  <Button variant="outline" size="sm" className="text-xs">
                    <Upload size={14} className="mr-1" />
                    Import
                  </Button>
                )}
                {icsConfig.exportEnabled && (
                  <Button variant="outline" size="sm" className="text-xs">
                    <Download size={14} className="mr-1" />
                    Export
                  </Button>
                )}
                {icsConfig.allowSubscribe && (
                  <Button variant="outline" size="sm" className="text-xs">
                    <RefreshCw size={14} className="mr-1" />
                    Subscribe
                  </Button>
                )}
              </div>
            )}
            
            {allowExternalSync && serviceType === 'none' && (
              <div className="mt-2">
                <Button variant="outline" size="sm" className="text-xs w-full">
                  <UploadCloud size={14} className="mr-1" />
                  Connect Calendar
                </Button>
              </div>
            )}
          </div>
        );
      }

      case "dropdown":
        return (
          <div className="p-3">
            <label className="block text-sm font-medium mb-1">
              {component.props.label}
            </label>
            <div className="relative">
              <select className="w-full p-2 border rounded-md appearance-none bg-white">
                <option value="" disabled selected>{component.props.placeholder}</option>
                {component.props.options?.map((option: string, index: number) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <List size={16} className="text-gray-500" />
              </div>
            </div>
          </div>
        );

      case "link":
        const linkStyles = {
          default: "text-widget-blue hover:underline",
          button: "px-4 py-2 bg-widget-blue text-white rounded hover:bg-blue-600 inline-block",
          underlined: "text-widget-blue underline hover:no-underline"
        };
        
        return (
          <div className="p-3">
            <a 
              href={component.props.url}
              target={component.props.openInNewTab ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className={`${linkStyles[component.props.style as keyof typeof linkStyles] || linkStyles.default} flex items-center`}
            >
              <LinkIcon size={16} className="mr-1" />
              {component.props.text}
            </a>
          </div>
        );

      case "multi-text":
        return (
          <div className="p-3">
            <label className="block text-sm font-medium mb-1">
              {component.props.label}
            </label>
            <textarea 
              className="w-full p-2 border rounded-md" 
              placeholder={component.props.placeholder}
              rows={component.props.rows || 4}
            />
          </div>
        );
      
      case "filter":
        return (
          <div className="p-3">
            <label className="block text-sm font-medium mb-1" style={{ color: component.props.textColor }}>
              {component.props.label}
            </label>
            <div className="relative">
              <div 
                className="flex items-center w-full p-2 rounded-md"
                style={{ 
                  backgroundColor: component.props.backgroundColor,
                  color: component.props.textColor,
                  border: `1px solid ${component.props.borderColor}`
                }}
              >
                <Filter size={16} className="mr-2" style={{ color: component.props.accentColor }} />
                <span>{component.props.placeholder}</span>
                {component.props.searchable && (
                  <div className="ml-auto">
                    <Search size={16} style={{ color: component.props.accentColor }} />
                  </div>
                )}
              </div>
              <div 
                className="absolute left-0 right-0 mt-1 p-1 rounded-md shadow-md z-10 hidden"
                style={{ 
                  backgroundColor: component.props.backgroundColor,
                  border: `1px solid ${component.props.borderColor}`
                }}
              >
                {component.props.options?.map((option: string, index: number) => (
                  <div 
                    key={index} 
                    className="p-2 rounded hover:bg-opacity-10 cursor-pointer flex items-center"
                    style={{ 
                      color: component.props.textColor,
                      backgroundColor: index % 2 === 0 ? 'rgba(0,0,0,0.03)' : 'transparent'
                    }}
                  >
                    {component.props.multiple && (
                      <div 
                        className="w-4 h-4 mr-2 border rounded flex items-center justify-center"
                        style={{ borderColor: component.props.accentColor }}
                      >
                        {index === 0 && <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: component.props.accentColor }}></div>}
                      </div>
                    )}
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case "alert":
        if (dismissedAlerts.includes(component.id)) {
          return null;
        }
        
        const getAlertIcon = (type: AlertType) => {
          switch (type) {
            case "info":
              return <Info size={20} className="mr-2 shrink-0" />;
            case "success":
              return <CheckCircle size={20} className="mr-2 shrink-0" />;
            case "warning":
              return <AlertTriangle size={20} className="mr-2 shrink-0" />;
            case "error":
              return <XCircle size={20} className="mr-2 shrink-0" />;
            default:
              return <Info size={20} className="mr-2 shrink-0" />;
          }
        };
        
        const getDefaultColors = (type: AlertType) => {
          switch (type) {
            case "info":
              return { bg: "#EFF6FF", text: "#1E3A8A", border: "#BFDBFE" };
            case "success":
              return { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" };
            case "warning":
              return { bg: "#FFFBEB", text: "#854D0E", border: "#FEF3C7" };
            case "error":
              return { bg: "#FEF2F2", text: "#991B1B", border: "#FEE2E2" };
            default:
              return { bg: "#EFF6FF", text: "#1E3A8A", border: "#BFDBFE" };
          }
        };
        
        const defaultColors = getDefaultColors(component.props.type as AlertType);
        
        return (
          <div className="p-3">
            <div 
              className="rounded-md p-3 flex items-start"
              style={{ 
                backgroundColor: component.props.backgroundColor || defaultColors.bg,
                borderLeft: `4px solid ${component.props.borderColor || defaultColors.border}`,
                color: component.props.textColor || defaultColors.text
              }}
            >
              {component.props.icon && getAlertIcon(component.props.type as AlertType)}
              
              <div className="flex-1">
                <div className="font-medium">{component.props.title}</div>
                <div className="text-sm">{component.props.message}</div>
              </div>
              
              {component.props.dismissible && (
                <button 
                  onClick={() => dismissAlert(component.id)}
                  className="ml-2 p-1 rounded-full hover:bg-opacity-10 hover:bg-black"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        );
      
      case "table":
        return (
          <div className="p-3">
            <div 
              className="rounded-md border overflow-hidden"
              style={{ 
                borderColor: component.props.borderColor 
              }}
            >
              <Table>
                <TableHeader>
                  <TableRow style={{ 
                    backgroundColor: component.props.headerBackgroundColor 
                  }}>
                    {component.props.columns?.map((column: TableColumn, index: number) => (
                      <TableHead 
                        key={index}
                        style={{ 
                          color: component.props.headerTextColor,
                          borderColor: component.props.bordered ? component.props.borderColor : 'transparent'
                        }}
                        className={component.props.compact ? 'py-2' : ''}
                      >
                        {column.header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {component.props.data?.map((row: any, rowIndex: number) => (
                    <TableRow 
                      key={rowIndex}
                      style={{ 
                        backgroundColor: component.props.striped && rowIndex % 2 === 1 
                          ? component.props.altRowBackgroundColor 
                          : component.props.rowBackgroundColor,
                        color: component.props.rowTextColor,
                        borderColor: component.props.borderColor,
                        '--hover-bg': 'rgba(0,0,0,0.05)'
                      } as React.CSSProperties}
                      className={`${component.props.hoverable ? 'hover:bg-[--hover-bg]' : ''}`}
                    >
                      {component.props.columns?.map((column: TableColumn, colIndex: number) => (
                        <TableCell 
                          key={colIndex}
                          style={{ 
                            borderColor: component.props.bordered ? component.props.borderColor : 'transparent' 
                          }}
                          className={component.props.compact ? 'py-2' : ''}
                        >
                          {column.type === 'number' 
                            ? Number(row[column.accessor]).toLocaleString()
                            : row[column.accessor]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );
      
      default:
        return <div className="p-3">Unknown component type: {component.type}</div>;
    }
  };

  return (
    <div className="bg-white border border-widget-border rounded-md shadow-sm overflow-hidden" style={{ width: '316px', height: '384px', overflow: 'auto' }}>
      {components.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-400">
          <p>Widget preview will appear here</p>
        </div>
      ) : (
        <div>
          {components.map((component) => (
            <div key={component.id}>
              {renderComponent(component)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WidgetPreview;
