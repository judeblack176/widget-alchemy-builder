import React, { useState, useEffect } from 'react';
import { X, HelpCircle } from 'lucide-react';
import { WidgetComponent, ApiConfig, Tooltip } from '@/types/widget-types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import ApiFieldMapping from './ApiFieldMapping';

interface ComponentEditorProps {
  component: WidgetComponent;
  onUpdateComponent: (component: WidgetComponent) => void;
  onClose: () => void;
  availableApis: ApiConfig[];
  onRequestApiTemplate: (componentId: string) => void;
  onApplyTooltip: (tooltipId: string) => void;
  tooltips: Tooltip[];
}

const ComponentEditor: React.FC<ComponentEditorProps> = ({
  component,
  onUpdateComponent,
  onClose,
  availableApis,
  onRequestApiTemplate,
  onApplyTooltip,
  tooltips
}) => {
  const isApiCompatible = component.type !== 'header';
  const [isTooltipModalOpen, setIsTooltipModalOpen] = useState(false);

  const [textFormatting, setTextFormatting] = useState({
    fontSize: component.props?.fontSize || 'medium',
    fontFamily: component.props?.fontFamily || 'default',
    textAlign: component.props?.textAlign || 'left',
    isBold: component.props?.isBold || false,
    isItalic: component.props?.isItalic || false,
    textColor: component.props?.textColor || "#000000"
  });

  const handleTextFormattingChange = (propertyName: string, value: any) => {
    setTextFormatting(prev => ({
      ...prev,
      [propertyName]: value
    }));
    
    handlePropertyChange(propertyName, value);
  };

  const handlePropertyChange = (propertyName: string, value: any) => {
    const updatedComponent: WidgetComponent = {
      ...component,
      props: {
        ...component.props,
        [propertyName]: value,
      },
    };
    onUpdateComponent(updatedComponent);
  };

  const handleApiConfigChange = (apiId: string) => {
    const updatedComponent: WidgetComponent = {
      ...component,
      apiConfig: {
        ...component.apiConfig,
        apiId: apiId === "" ? undefined : apiId,
      },
    };
    onUpdateComponent(updatedComponent);
  };

  // Add handlers for API field mappings
  const handleAddApiFieldMapping = () => {
    if (!component.apiConfig?.apiId) return;

    const updatedComponent = {
      ...component,
      apiFieldMappings: [
        ...(component.apiFieldMappings || []),
        {
          id: `mapping-${Date.now()}`,
          field: '',
          targetProperty: ''
        }
      ]
    };

    onUpdateComponent(updatedComponent);
  };

  const handleUpdateApiFieldMapping = (id: string, field: string, value: string) => {
    if (!component.apiFieldMappings) return;

    const updatedMappings = component.apiFieldMappings.map(mapping => 
      mapping.id === id ? { ...mapping, [field]: value } : mapping
    );

    const updatedComponent = {
      ...component,
      apiFieldMappings: updatedMappings
    };

    onUpdateComponent(updatedComponent);
  };

  const handleRemoveApiFieldMapping = (id: string) => {
    if (!component.apiFieldMappings) return;

    const updatedMappings = component.apiFieldMappings.filter(mapping => mapping.id !== id);

    const updatedComponent = {
      ...component,
      apiFieldMappings: updatedMappings
    };

    onUpdateComponent(updatedComponent);
  };

  // Generate a list of component properties for mapping
  const getComponentProperties = () => {
    switch (component.type) {
      case 'text':
        return ['content', 'fontSize', 'fontFamily', 'textAlign', 'textColor'];
      case 'header':
        return ['title', 'icon'];
      case 'image':
        return ['source', 'altText', 'caption'];
      case 'button':
        return ['text', 'onClick'];
      case 'video':
        return ['source', 'title'];
      default:
        return Object.keys(component.props || {});
    }
  };

  const renderProperties = () => {
    switch (component.type) {
      case 'header':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="header-title">Title</Label>
              <Input
                type="text"
                id="header-title"
                value={component.props.title || ''}
                onChange={(e) => handlePropertyChange('title', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="header-icon">Icon</Label>
              <Input
                type="text"
                id="header-icon"
                value={component.props.icon || ''}
                onChange={(e) => handlePropertyChange('icon', e.target.value)}
              />
            </div>
          </>
        );
      case 'text':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="text-font-size">Font Size</Label>
              <Select
                value={textFormatting.fontSize}
                onValueChange={(value) => handleTextFormattingChange('fontSize', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="xlarge">XLarge</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="text-font-family">Font Family</Label>
              <Select
                value={textFormatting.fontFamily}
                onValueChange={(value) => handleTextFormattingChange('fontFamily', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font family" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="text-text-align">Text Align</Label>
              <Select
                value={textFormatting.textAlign}
                onValueChange={(value) => handleTextFormattingChange('textAlign', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select text align" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="justify">Justify</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="text-is-bold">Bold</Label>
              <Switch
                id="text-is-bold"
                checked={textFormatting.isBold}
                onCheckedChange={(checked) => handleTextFormattingChange('isBold', checked)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="text-is-italic">Italic</Label>
              <Switch
                id="text-is-italic"
                checked={textFormatting.isItalic}
                onCheckedChange={(checked) => handleTextFormattingChange('isItalic', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text-color">Text Color</Label>
              <Input
                type="color"
                id="text-color"
                value={textFormatting.textColor}
                onChange={(e) => handleTextFormattingChange('textColor', e.target.value)}
              />
            </div>
          </>
        );
      case 'image':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="image-source">Source URL</Label>
              <Input
                type="text"
                id="image-source"
                value={component.props.source || ''}
                onChange={(e) => handlePropertyChange('source', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-alt-text">Alt Text</Label>
              <Input
                type="text"
                id="image-alt-text"
                value={component.props.altText || ''}
                onChange={(e) => handlePropertyChange('altText', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-caption">Caption</Label>
              <Input
                type="text"
                id="image-caption"
                value={component.props.caption || ''}
                onChange={(e) => handlePropertyChange('caption', e.target.value)}
              />
            </div>
          </>
        );
      case 'button':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="button-text">Text</Label>
              <Input
                type="text"
                id="button-text"
                value={component.props.text || ''}
                onChange={(e) => handlePropertyChange('text', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="button-onclick">onClick Action</Label>
              <Input
                type="text"
                id="button-onclick"
                value={component.props.onClick || ''}
                onChange={(e) => handlePropertyChange('onClick', e.target.value)}
              />
            </div>
          </>
        );
        case 'alert':
          return (
            <>
              <div className="space-y-2">
                <Label htmlFor="alert-title">Title</Label>
                <Input
                  type="text"
                  id="alert-title"
                  value={component.props.title || ''}
                  onChange={(e) => handlePropertyChange('title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alert-variant">Variant</Label>
                <Select
                  value={component.props.variant || 'default'}
                  onValueChange={(value) => handlePropertyChange('variant', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select variant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="destructive">Destructive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          );
      case 'video':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="video-source">Source URL</Label>
              <Input
                type="text"
                id="video-source"
                value={component.props.source || ''}
                onChange={(e) => handlePropertyChange('source', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video-title">Title</Label>
              <Input
                type="text"
                id="video-title"
                value={component.props.title || ''}
                onChange={(e) => handlePropertyChange('title', e.target.value)}
              />
            </div>
          </>
        );
      default:
        return <p>No properties to edit for this component.</p>;
    }
  };

  const renderContentEditor = () => {
    const handleContentChange = (content: string) => {
      const updatedComponent: WidgetComponent = {
        ...component,
        props: {
          ...component.props,
          content: content,
        },
        formattedContent: content,
      };
      onUpdateComponent(updatedComponent);
    };

    return (
      <Textarea
        value={component.props.content || component.formattedContent || ''}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder="Enter content here..."
        className="w-full"
      />
    );
  };

  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-widget-blue">
            Edit {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
          </h3>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
        </div>

        {/* API Configuration */}
        {isApiCompatible && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">API Configuration</h4>
              {!component.apiConfig?.apiId && availableApis.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRequestApiTemplate(component.id)}
                >
                  Use API Template
                </Button>
              )}
            </div>

            {availableApis.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No APIs available. Add an API from the APIs panel first.
              </div>
            ) : (
              <div className="space-y-4">
                <Select
                  value={component.apiConfig?.apiId || ""}
                  onValueChange={handleApiConfigChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an API" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {availableApis.map(api => (
                      <SelectItem key={api.id} value={api.id}>
                        {api.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* API Field Mappings Section - Add above content editor */}
                {component.apiConfig?.apiId && (
                  <ApiFieldMapping
                    apis={availableApis}
                    selectedApiId={component.apiConfig.apiId}
                    apiFieldMappings={component.apiFieldMappings || []}
                    onAddMapping={handleAddApiFieldMapping}
                    onUpdateMapping={handleUpdateApiFieldMapping}
                    onRemoveMapping={handleRemoveApiFieldMapping}
                    componentProperties={getComponentProperties()}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Content Editor */}
        {(component.type === 'text' || component.type === 'header' || component.type === 'alert') && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Content</h4>
            {renderContentEditor()}
          </div>
        )}

        {/* Properties */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Properties</h4>
          {renderProperties()}
        </div>

        {/* Tooltip Selection */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Tooltip</h4>
            {!component.tooltipId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTooltipModalOpen(true)}
              >
                <HelpCircle size={14} className="mr-1" /> Add Tooltip
              </Button>
            )}
          </div>

          {component.tooltipId ? (
            <div className="flex justify-between items-center rounded-md border p-2">
              <div className="flex items-center">
                <HelpCircle size={16} className="text-blue-500 mr-2" />
                <span className="text-sm">
                  {tooltips.find(t => t.id === component.tooltipId)?.title || 'Tooltip'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleApplyTooltip('')}
              >
                <X size={14} className="mr-1" /> Remove
              </Button>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No tooltip applied. Add one to provide contextual help.
            </div>
          )}
        </div>
      </div>

      <Dialog open={isTooltipModalOpen} onOpenChange={setIsTooltipModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select a Tooltip</DialogTitle>
            <DialogDescription>
              Choose a tooltip to provide more information about this component.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {tooltips.map(tooltip => (
              <div key={tooltip.id} className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    handleApplyTooltip(tooltip.id);
                    setIsTooltipModalOpen(false);
                  }}
                >
                  {tooltip.title}
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setIsTooltipModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComponentEditor;
