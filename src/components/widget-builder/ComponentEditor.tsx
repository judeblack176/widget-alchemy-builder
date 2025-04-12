import React, { useState, useEffect } from 'react';
import { WidgetComponent, ApiConfig, ComponentDefinition, ComponentType, PREDEFINED_COLORS, Tooltip, ApiFieldMapping } from '@/types/widget-types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { renderComponent } from './component-renderers';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, ChevronUp, Trash2, Database, HelpCircle, AlertCircle, Info, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import ApiFieldMappingEditor from './ApiFieldMapping';

interface ComponentEditorProps {
  component: WidgetComponent;
  apis: ApiConfig[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onRequestApiTemplate: () => void;
  onApplyTooltip?: (tooltipId: string) => void;
  disableRemove?: boolean;
  customTooltips?: Tooltip[];
}

// Component definitions for the editor
const COMPONENT_DEFINITIONS: ComponentDefinition[] = [
  {
    type: 'header',
    name: 'Header',
    icon: 'Heading',
    defaultProps: {
      title: 'Header Title',
      subtitle: 'Subtitle text',
      align: 'left',
      size: 'medium',
      color: '#000000',
      backgroundColor: 'transparent',
    },
    availableProps: [
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'subtitle', type: 'text', label: 'Subtitle' },
      { name: 'align', type: 'select', label: 'Alignment', options: ['left', 'center', 'right'] },
      { name: 'size', type: 'select', label: 'Size', options: ['small', 'medium', 'large'] },
      { name: 'color', type: 'color', label: 'Text Color' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'icon', type: 'icon', label: 'Icon' },
    ],
    supportsApiIntegration: true,
    defaultDataMapping: {
      title: 'title',
      subtitle: 'subtitle',
    }
  },
  {
    type: 'text',
    name: 'Text',
    icon: 'Type',
    defaultProps: {
      content: 'Text content goes here',
      align: 'left',
      size: 'medium',
      color: '#000000',
      backgroundColor: 'transparent',
    },
    availableProps: [
      { name: 'content', type: 'text', label: 'Content' },
      { name: 'align', type: 'select', label: 'Alignment', options: ['left', 'center', 'right'] },
      { name: 'size', type: 'select', label: 'Size', options: ['small', 'medium', 'large'] },
      { name: 'color', type: 'color', label: 'Text Color' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'font', type: 'font', label: 'Font' },
    ],
    supportsApiIntegration: true,
    defaultDataMapping: {
      content: 'content',
    }
  },
  {
    type: 'image',
    name: 'Image',
    icon: 'Image',
    defaultProps: {
      source: 'https://via.placeholder.com/300x200',
      altText: 'Image description',
      caption: '',
      width: '100%',
      height: 'auto',
      borderRadius: '0',
    },
    availableProps: [
      { name: 'source', type: 'text', label: 'Image URL' },
      { name: 'altText', type: 'text', label: 'Alt Text' },
      { name: 'caption', type: 'text', label: 'Caption' },
      { name: 'width', type: 'text', label: 'Width' },
      { name: 'height', type: 'text', label: 'Height' },
      { name: 'borderRadius', type: 'text', label: 'Border Radius' },
    ],
    supportsApiIntegration: true,
    defaultDataMapping: {
      source: 'imageUrl',
      altText: 'altText',
      caption: 'caption',
    }
  },
  {
    type: 'button',
    name: 'Button',
    icon: 'Square',
    defaultProps: {
      label: 'Click Me',
      variant: 'default',
      size: 'default',
      url: '#',
      align: 'left',
    },
    availableProps: [
      { name: 'label', type: 'text', label: 'Button Text' },
      { name: 'variant', type: 'select', label: 'Variant', options: ['default', 'outline', 'secondary', 'ghost', 'link', 'destructive'] },
      { name: 'size', type: 'select', label: 'Size', options: ['default', 'sm', 'lg', 'icon'] },
      { name: 'url', type: 'text', label: 'URL' },
      { name: 'align', type: 'select', label: 'Alignment', options: ['left', 'center', 'right'] },
    ],
    supportsApiIntegration: true,
    defaultDataMapping: {
      label: 'buttonText',
      url: 'buttonUrl',
    }
  },
  {
    type: 'video',
    name: 'Video',
    icon: 'Video',
    defaultProps: {
      source: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      title: 'Video Title',
      autoplay: false,
      controls: true,
      width: '100%',
      height: '315',
    },
    availableProps: [
      { name: 'source', type: 'text', label: 'Video URL' },
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'autoplay', type: 'select', label: 'Autoplay', options: ['true', 'false'] },
      { name: 'controls', type: 'select', label: 'Show Controls', options: ['true', 'false'] },
      { name: 'width', type: 'text', label: 'Width' },
      { name: 'height', type: 'text', label: 'Height' },
    ],
    supportsApiIntegration: true,
    defaultDataMapping: {
      source: 'videoUrl',
      title: 'videoTitle',
    }
  },
  {
    type: 'chart',
    name: 'Chart',
    icon: 'BarChart',
    defaultProps: {
      type: 'bar',
      title: 'Chart Title',
      labels: ['Label 1', 'Label 2', 'Label 3'],
      data: [10, 20, 30],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    },
    availableProps: [
      { name: 'type', type: 'select', label: 'Chart Type', options: ['bar', 'line', 'pie', 'doughnut'] },
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'labels', type: 'text', label: 'Labels (comma separated)' },
      { name: 'data', type: 'text', label: 'Data (comma separated)' },
    ],
    supportsApiIntegration: true,
    defaultDataMapping: {
      data: 'chartData',
      labels: 'chartLabels',
    }
  },
  {
    type: 'form',
    name: 'Form',
    icon: 'FileText',
    defaultProps: {
      fields: [
        { type: 'text', label: 'Name', placeholder: 'Enter your name', required: true },
        { type: 'email', label: 'Email', placeholder: 'Enter your email', required: true },
        { type: 'textarea', label: 'Message', placeholder: 'Enter your message', required: false },
      ],
      submitLabel: 'Submit',
      successMessage: 'Form submitted successfully!',
    },
    availableProps: [
      { name: 'submitLabel', type: 'text', label: 'Submit Button Label' },
      { name: 'successMessage', type: 'text', label: 'Success Message' },
    ],
    supportsApiIntegration: true,
  },
  {
    type: 'calendar',
    name: 'Calendar',
    icon: 'Calendar',
    defaultProps: {
      events: [
        { title: 'Event 1', start: '2023-01-01', end: '2023-01-02' },
        { title: 'Event 2', start: '2023-01-05', end: '2023-01-07' },
      ],
      view: 'month',
      firstDay: 0,
    },
    availableProps: [
      { name: 'view', type: 'select', label: 'Default View', options: ['month', 'week', 'day', 'agenda'] },
      { name: 'firstDay', type: 'select', label: 'First Day of Week', options: ['0', '1'] },
    ],
    supportsApiIntegration: true,
    defaultDataMapping: {
      events: 'events',
    }
  },
  {
    type: 'dropdown',
    name: 'Dropdown',
    icon: 'ChevronDown',
    defaultProps: {
      label: 'Select an option',
      placeholder: 'Choose...',
      options: ['Option 1', 'Option 2', 'Option 3'],
      defaultValue: '',
    },
    availableProps: [
      { name: 'label', type: 'text', label: 'Label' },
      { name: 'placeholder', type: 'text', label: 'Placeholder' },
      { name: 'options', type: 'text', label: 'Options (comma separated)' },
      { name: 'defaultValue', type: 'text', label: 'Default Value' },
    ],
    supportsApiIntegration: true,
    defaultDataMapping: {
      options: 'dropdownOptions',
    }
  },
  {
    type: 'link',
    name: 'Link',
    icon: 'Link',
    defaultProps: {
      text: 'Click here',
      url: '#',
      target: '_self',
      color: '#3B82F6',
    },
    availableProps: [
      { name: 'text', type: 'text', label: 'Link Text' },
      { name: 'url', type: 'text', label: 'URL' },
      { name: 'target', type: 'select', label: 'Target', options: ['_self', '_blank'] },
      { name: 'color', type: 'color', label: 'Link Color' },
    ],
    supportsApiIntegration: true,
    defaultDataMapping: {
      text: 'linkText',
      url: 'linkUrl',
    }
  },
  {
    type: 'multi-text',
    name: 'Multi-Text',
    icon: 'ListOrdered',
    defaultProps: {
      items: ['Item 1', 'Item 2', 'Item 3'],
      type: 'bullet',
      spacing: 'normal',
    },
    availableProps: [
      { name: 'items', type: 'text', label: 'Items (one per line)' },
      { name: 'type', type: 'select', label: 'List Type', options: ['bullet', 'numbered', 'check'] },
      { name: 'spacing', type: 'select', label: 'Spacing', options: ['tight', 'normal', 'relaxed'] },
    ],
    supportsApiIntegration: true,
    defaultDataMapping: {
      items: 'listItems',
    }
  },
  {
    type: 'filter',
    name: 'Filter',
    icon: 'Filter',
    defaultProps: {
      label: 'Filter by',
      options: ['All', 'Option 1', 'Option 2', 'Option 3'],
      defaultValue: 'All',
      multiple: false,
    },
    availableProps: [
      { name: 'label', type: 'text', label: 'Label' },
      { name: 'options', type: 'text', label: 'Options (comma separated)' },
      { name: 'defaultValue', type: 'text', label: 'Default Value' },
      { name: 'multiple', type: 'select', label: 'Multiple Selection', options: ['true', 'false'] },
    ],
    supportsApiIntegration: true,
    defaultDataMapping: {
      options: 'filterOptions',
    }
  },
  {
    type: 'alert',
    name: 'Alert',
    icon: 'AlertCircle',
    defaultProps: {
      title: 'Alert Title',
      content: 'This is an alert message.',
      type: 'info',
      dismissible: true,
    },
    availableProps: [
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'content', type: 'text', label: 'Content' },
      { name: 'type', type: 'select', label: 'Type', options: ['info', 'success', 'warning', 'error'] },
      { name: 'dismissible', type: 'select', label: 'Dismissible', options: ['true', 'false'] },
    ],
    supportsApiIntegration: true,
    defaultDataMapping: {
      title: 'alertTitle',
      content: 'alertMessage',
      type: 'alertType',
    }
  },
  {
    type: 'table',
    name: 'Table',
    icon: 'Table',
    defaultProps: {
      columns: [
        { header: 'Name', accessor: 'name' },
        { header: 'Age', accessor: 'age' },
        { header: 'Status', accessor: 'status' },
      ],
      data: [
        { name: 'John', age: 25, status: 'Active' },
        { name: 'Jane', age: 30, status: 'Inactive' },
      ],
      striped: true,
      bordered: true,
    },
    availableProps: [
      { name: 'striped', type: 'select', label: 'Striped Rows', options: ['true', 'false'] },
      { name: 'bordered', type: 'select', label: 'Bordered', options: ['true', 'false'] },
    ],
    supportsApiIntegration: true,
    defaultDataMapping: {
      data: 'tableData',
      columns: 'tableColumns',
    }
  },
  {
    type: 'searchbar',
    name: 'Search Bar',
    icon: 'Search',
    defaultProps: {
      placeholder: 'Search...',
      label: 'Search',
      showIcon: true,
    },
    availableProps: [
      { name: 'placeholder', type: 'text', label: 'Placeholder' },
      { name: 'label', type: 'text', label: 'Label' },
      { name: 'showIcon', type: 'select', label: 'Show Icon', options: ['true', 'false'] },
    ],
    supportsApiIntegration: true,
    defaultDataMapping: {
      placeholder: 'searchPlaceholder',
    }
  },
];

const ComponentEditor: React.FC<ComponentEditorProps> = ({
  component,
  apis,
  isExpanded,
  onToggleExpand,
  onUpdateComponent,
  onRemoveComponent,
  onRequestApiTemplate,
  onApplyTooltip,
  disableRemove = false,
  customTooltips = [],
}) => {
  const [isApiDialogOpen, setIsApiDialogOpen] = useState(false);
  const [isTooltipDialogOpen, setIsTooltipDialogOpen] = useState(false);
  const [selectedApi, setSelectedApi] = useState<string>(component.apiConfig?.apiId || '');
  const [mappings, setMappings] = useState<Record<string, string>>(component.apiConfig?.dataMapping || {});
  const [currentTab, setCurrentTab] = useState<'properties' | 'api' | 'content'>('properties');
  
  // Get the component definition from our predefined list
  const componentDefinition = COMPONENT_DEFINITIONS.find(def => def.type === component.type);
  const api = apis.find(api => api.id === selectedApi);
  const availableFields = api?.possibleFields || [];
  const hasApiIntegration = componentDefinition?.supportsApiIntegration && apis.length > 0;
  
  // State for content fields
  const [contentFields, setContentFields] = useState<ApiFieldMapping[]>(
    component.contentFields || []
  );
  const [formattedContent, setFormattedContent] = useState<string>(
    component.formattedContent || ''
  );

  // Initialize component props with defaults if not set
  useEffect(() => {
    if (componentDefinition) {
      const updatedProps = { ...componentDefinition.defaultProps, ...component.props };
      if (JSON.stringify(updatedProps) !== JSON.stringify(component.props)) {
        onUpdateComponent({
          ...component,
          props: updatedProps
        });
      }
    }
  }, [component.type]);

  // Update formatted content when content fields change
  useEffect(() => {
    let content = formattedContent;
    
    // If no formatted content but we have content fields, create a default template
    if ((!content || content === '') && contentFields.length > 0) {
      content = contentFields.map(field => `{{${field.label}}}`).join(' ');
    }
    
    setFormattedContent(content);
  }, [contentFields]);

  const handleUpdateContentField = (fields: ApiFieldMapping[]) => {
    setContentFields(fields);
    onUpdateComponent({
      ...component,
      contentFields: fields,
      formattedContent
    });
  };

  const handleUpdateFormattedContent = (content: string) => {
    setFormattedContent(content);
    onUpdateComponent({
      ...component,
      formattedContent: content,
      contentFields
    });
  };

  const handleAddContentField = (field: ApiFieldMapping) => {
    const updatedFields = [...contentFields, field];
    setContentFields(updatedFields);
    onUpdateComponent({
      ...component,
      contentFields: updatedFields,
      formattedContent
    });
  };

  const handleRemoveContentField = (index: number) => {
    const updatedFields = contentFields.filter((_, i) => i !== index);
    setContentFields(updatedFields);
    onUpdateComponent({
      ...component,
      contentFields: updatedFields,
      formattedContent
    });
  };

  const handleApiSelection = (apiId: string) => {
    setSelectedApi(apiId);
    setMappings({});

    if (apiId) {
      onUpdateComponent({
        ...component,
        apiConfig: {
          apiId,
          dataMapping: {},
        },
        contentFields,
        formattedContent
      });
    } else {
      const { apiConfig, ...restComponent } = component;
      onUpdateComponent({
        ...restComponent,
        contentFields,
        formattedContent
      });
    }
  };

  const handleMappingChange = (propName: string, fieldName: string) => {
    const updatedMappings = { ...mappings, [propName]: fieldName };
    setMappings(updatedMappings);

    onUpdateComponent({
      ...component,
      apiConfig: {
        apiId: selectedApi,
        dataMapping: updatedMappings,
      },
      contentFields,
      formattedContent
    });
  };

  const handlePropChange = (propName: string, value: any) => {
    const updatedProps = { ...component.props, [propName]: value };
    onUpdateComponent({
      ...component,
      props: updatedProps
    });
  };

  const renderPropEditor = (propDef: { name: string; type: string; label: string; options?: string[] }) => {
    const { name, type, label, options } = propDef;
    const value = component.props[name] !== undefined ? component.props[name] : '';

    switch (type) {
      case 'text':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={`prop-${name}`}>{label}</Label>
            <Input
              id={`prop-${name}`}
              value={value}
              onChange={(e) => handlePropChange(name, e.target.value)}
            />
          </div>
        );
      case 'number':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={`prop-${name}`}>{label}</Label>
            <Input
              id={`prop-${name}`}
              type="number"
              value={value}
              onChange={(e) => handlePropChange(name, parseFloat(e.target.value))}
            />
          </div>
        );
      case 'select':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={`prop-${name}`}>{label}</Label>
            <Select
              value={value.toString()}
              onValueChange={(val) => handlePropChange(name, val)}
            >
              <SelectTrigger id={`prop-${name}`}>
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'color':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={`prop-${name}`}>{label}</Label>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full border"
                        style={{ backgroundColor: value || 'transparent' }}
                      />
                      <span>{value || 'Select color'}</span>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="grid grid-cols-5 gap-2">
                    {PREDEFINED_COLORS.map((color) => (
                      <div
                        key={color}
                        className="h-6 w-6 cursor-pointer rounded-full border"
                        style={{ backgroundColor: color }}
                        onClick={() => handlePropChange(name, color)}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        );
      default:
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={`prop-${name}`}>{label}</Label>
            <Input
              id={`prop-${name}`}
              value={value}
              onChange={(e) => handlePropChange(name, e.target.value)}
            />
          </div>
        );
    }
  };

  const renderApiMappingFields = () => {
    if (!componentDefinition || !api) return null;

    return (
      <div className="space-y-4">
        <div className="text-sm font-medium">Map API Fields to Component Properties</div>
        {componentDefinition.availableProps.map((propDef) => (
          <div key={propDef.name} className="space-y-2">
            <Label htmlFor={`mapping-${propDef.name}`}>{propDef.label}</Label>
            <Select
              value={mappings[propDef.name] || ''}
              onValueChange={(val) => handleMappingChange(propDef.name, val)}
            >
              <SelectTrigger id={`mapping-${propDef.name}`}>
                <SelectValue placeholder={`Select field for ${propDef.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {availableFields.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    );
  };

  const renderPreview = () => {
    return (
      <div className="border rounded-md p-3 bg-muted/30">
        <div className="text-sm font-medium mb-2">Component Preview</div>
        <div className="p-2 bg-white rounded border">
          {renderComponent(component)}
        </div>
      </div>
    );
  };

  const getTooltipOptions = () => {
    const defaultTooltips = [
      { id: '', title: 'None', content: 'No tooltip' },
      { id: 'help', title: 'Help', content: 'Help information about this feature' },
      { id: 'info', title: 'Information', content: 'Additional information about this component' },
      { id: 'warning', title: 'Warning', content: 'Warning: Please review this information carefully' },
      { id: 'tip', title: 'Tip', content: 'Pro Tip: This feature can help you save time' },
    ];

    return [...defaultTooltips, ...customTooltips];
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-normal">
            {componentDefinition?.name || component.type}
          </Badge>
          {component.tooltipId && (
            <Badge variant="secondary" className="font-normal">
              <HelpCircle className="h-3 w-3 mr-1" /> Has Tooltip
            </Badge>
          )}
          {component.apiConfig?.apiId && (
            <Badge variant="secondary" className="font-normal">
              <Database className="h-3 w-3 mr-1" /> API Connected
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleExpand}
            className="w-8 h-8 rounded-full"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <CollapsibleContent className={isExpanded ? "block" : "hidden"}>
        <Tabs value={currentTab} onValueChange={(v) => setCurrentTab(v as any)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            {hasApiIntegration && <TabsTrigger value="api">API Integration</TabsTrigger>}
            {component.type === 'text' && <TabsTrigger value="content">Content</TabsTrigger>}
          </TabsList>

          <TabsContent value="properties" className="space-y-4">
            {componentDefinition?.availableProps.map(renderPropEditor)}
            {renderPreview()}
          </TabsContent>

          {hasApiIntegration && (
            <TabsContent value="api" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-select">Select API</Label>
                <Select
                  value={selectedApi}
                  onValueChange={handleApiSelection}
                >
                  <SelectTrigger id="api-select">
                    <SelectValue placeholder="Select an API" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {apis.map((api) => (
                      <SelectItem key={api.id} value={api.id}>
                        {api.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedApi && (
                <>
                  {renderApiMappingFields()}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setIsApiDialogOpen(true)}
                  >
                    <Database className="h-4 w-4 mr-2" /> View API Details
                  </Button>
                </>
              )}

              {apis.length === 0 && (
                <div className="text-center py-4">
                  <Database className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No APIs available</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={onRequestApiTemplate}
                  >
                    Add API from Template
                  </Button>
                </div>
              )}
            </TabsContent>
          )}

          {component.type === 'text' && (
            <TabsContent value="content" className="space-y-4">
              <div className="space-y-4">
                <ApiFieldMappingEditor
                  availableFields={availableFields}
                  onAddField={handleAddContentField}
                  onRemoveField={handleRemoveContentField}
                  fields={contentFields}
                />

                <div className="space-y-2">
                  <Label htmlFor="formattedContent">Formatted Content</Label>
                  <Textarea
                    id="formattedContent"
                    value={formattedContent}
                    onChange={(e) => handleUpdateFormattedContent(e.target.value)}
                    placeholder="Enter content with {{field}} placeholders"
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use {{fieldName}} syntax to include dynamic content from API mappings
                  </p>
                </div>

                <div className="border rounded-md p-3 bg-muted/30">
                  <div className="text-sm font-medium mb-2">Preview</div>
                  <div className="p-2 bg-white rounded border">
                    {formattedContent ? (
                      <div>
                        {contentFields.length > 0 ? (
                          formattedContent.replace(
                            /{{([^{}]+)}}/g,
                            (_match, placeholder) => {
                              const field = contentFields.find(f => f.label === placeholder);
                              return field ? `<${field.apiField}>` : `{{${placeholder}}}`;
                            }
                          )
                        ) : (
                          formattedContent
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No content defined</span>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>

        <div className="flex justify-between mt-4 pt-4 border-t">
          <div className="flex gap-2">
            {onApplyTooltip && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTooltipDialogOpen(true)}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                {component.tooltipId ? 'Change Tooltip' : 'Add Tooltip'}
              </Button>
            )}
          </div>
          {!disableRemove && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemoveComponent(component.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Remove
            </Button>
          )}
        </div>
      </CollapsibleContent>

      <Dialog open={isApiDialogOpen} onOpenChange={setIsApiDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>API Details</DialogTitle>
          </DialogHeader>
          {api && (
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Name</h3>
                  <p className="text-sm">{api.name}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Endpoint</h3>
                  <p className="text-sm font-mono bg-muted p-2 rounded">{api.endpoint}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Method</h3>
                  <Badge variant="outline">{api.method}</Badge>
                </div>
                {api.headers && Object.keys(api.headers).length > 0 && (
                  <div>
                    <h3 className="font-medium mb-1">Headers</h3>
                    <div className="bg-muted p-2 rounded">
                      {Object.entries(api.headers).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="font-medium">{key}:</span> {value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {api.sampleResponse && (
                  <div>
                    <h3 className="font-medium mb-1">Sample Response</h3>
                    <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-[200px]">
                      {api.sampleResponse}
                    </pre>
                  </div>
                )}
                {api.possibleFields && api.possibleFields.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-1">Available Fields</h3>
                    <div className="flex flex-wrap gap-1">
                      {api.possibleFields.map((field) => (
                        <Badge key={field} variant="outline" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApiDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isTooltipDialogOpen} onOpenChange={setIsTooltipDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Select Tooltip</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {getTooltipOptions().map((tooltip) => (
                <div
                  key={tooltip.id}
                  className={`p-3 rounded-md border cursor-pointer transition-colors ${
                    component.tooltipId === tooltip.id
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => {
                    if (onApplyTooltip) {
                      onApplyTooltip(tooltip.id);
                      setIsTooltipDialogOpen(false);
                    }
                  }}
                >
                  <div className="flex items-start gap-2">
                    {tooltip.id === 'help' && <HelpCircle size={16} className="text-blue-500 mt-0.5" />}
                    {tooltip.id === 'info' && <Info size={16} className="text-green-500 mt-0.5" />}
                    {tooltip.id === 'warning' && <AlertCircle size={16} className="text-amber-500 mt-0.5" />}
                    {tooltip.id === 'tip' && <HelpCircle size={16} className="text-purple-500 mt-0.5" />}
                    {tooltip.id === '' && <Check size={16} className="text-gray-500 mt-0.5" />}
                    <div>
                      <div className="font-medium text-sm">{tooltip.title}</div>
                      <div className="text-xs text-muted-foreground">{tooltip.content}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTooltipDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComponentEditor;
