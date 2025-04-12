import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WidgetComponent, ComponentType, ApiConfig, DEFAULT_DATA_MAPPINGS } from '@/types/widget-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ComponentLibrary from './ComponentLibrary';
import ComponentEditor from './ComponentEditor';
import WidgetPreview from './WidgetPreview';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Download, Settings, Code, FilePlus, MonitorSmartphone, Smartphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ApiManager from './ApiManager';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TooltipManager, { Tooltip as CustomTooltip } from './TooltipManager';

interface WidgetBuilderProps {
  initialComponents?: WidgetComponent[];
  initialApis?: ApiConfig[];
}

const WidgetBuilder: React.FC<WidgetBuilderProps> = ({ 
  initialComponents = [], 
  initialApis = []
}) => {
  const [components, setComponents] = useState<WidgetComponent[]>(initialComponents);
  const [apis, setApis] = useState<ApiConfig[]>(initialApis);
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('build');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [customTooltips, setCustomTooltips] = useState<CustomTooltip[]>([]);
  const { toast } = useToast();

  const onAddComponent = (componentType: ComponentType) => {
    const hasHeader = components.some(comp => comp.type === 'header');
    
    // If adding a header but one already exists, show warning
    if (componentType === 'header' && hasHeader) {
      toast({
        title: "Cannot add another header",
        description: "A widget can only have one header component.",
        variant: "destructive",
      });
      return;
    }
    
    const newId = uuidv4();
    
    const newComponent: WidgetComponent = {
      id: newId,
      type: componentType,
      props: getDefaultProps(componentType),
    };
    
    // Place header at the top
    if (componentType === 'header') {
      setComponents([newComponent, ...components]);
    } else {
      setComponents([...components, newComponent]);
    }
    
    setExpandedComponent(newId);
  };

  const onAddMultipleComponents = (componentTypes: ComponentType[]) => {
    const hasHeader = components.some(comp => comp.type === 'header');
    const newComponents: WidgetComponent[] = [];
    
    componentTypes.forEach(componentType => {
      // Skip adding header if one already exists
      if (componentType === 'header' && hasHeader) {
        toast({
          title: "Skipped adding header",
          description: "A widget can only have one header component.",
          variant: "destructive",
        });
        return;
      }
      
      const newId = uuidv4();
      
      const newComponent: WidgetComponent = {
        id: newId,
        type: componentType,
        props: getDefaultProps(componentType),
      };
      
      newComponents.push(newComponent);
    });
    
    // Separate headers from other components
    const headerComponents = newComponents.filter(c => c.type === 'header');
    const nonHeaderComponents = newComponents.filter(c => c.type !== 'header');
    
    // Place headers at the top
    if (headerComponents.length > 0) {
      setComponents([...headerComponents, ...components, ...nonHeaderComponents]);
    } else {
      setComponents([...components, ...newComponents]);
    }
    
    toast({
      title: `Added ${newComponents.length} components`,
      description: `Successfully added ${newComponents.length} new components to your widget.`
    });
  };

  const onUpdateComponent = (updatedComponent: WidgetComponent) => {
    setComponents(prevComponents =>
      prevComponents.map(comp =>
        comp.id === updatedComponent.id ? updatedComponent : comp
      )
    );
  };

  const onRemoveComponent = (componentId: string) => {
    setComponents(prevComponents =>
      prevComponents.filter(comp => comp.id !== componentId)
    );
    
    if (expandedComponent === componentId) {
      setExpandedComponent(null);
    }
  };

  const onToggleExpand = (componentId: string) => {
    setExpandedComponent(
      expandedComponent === componentId ? null : componentId
    );
  };

  const getDefaultProps = (componentType: ComponentType) => {
    switch (componentType) {
      case 'header':
        return {
          title: 'Widget Header',
          icon: 'BookOpen',
          backgroundColor: '#3B82F6',
          textColor: '#FFFFFF',
        };
      case 'text':
        return {
          content: 'Add your text content here',
          size: 'medium',
          color: '#333333',
          fontStyle: '',
        };
      case 'button':
        return {
          label: 'Click Me',
          variant: 'default',
          backgroundColor: '#3B82F6',
          textColor: '#FFFFFF',
        };
      case 'image':
        return {
          source: 'https://via.placeholder.com/300',
          altText: 'Image description',
          width: '100%',
          height: 'auto',
        };
      
      case 'video':
        return {
          source: 'https://example.com/video.mp4',
          controls: true,
          autoplay: false,
        };
      case 'chart':
        return {
          chartType: 'bar',
          title: 'Sample Chart',
          dataSource: 'static',
          staticData: '10,20,30,40,50',
          labels: 'A,B,C,D,E',
          legend: 'true',
          legendPosition: 'bottom',
          colors: '#3B82F6,#EF4444,#10B981,#F59E0B',
          height: '300',
        };
      case 'form':
        return {
          label: 'Enter your name',
          placeholder: 'Your name',
          fieldType: 'text',
        };
      case 'calendar':
        return {
          label: 'Select a date',
          placeholder: 'Pick a date',
          calendarType: 'date-picker',
          calendarProvider: 'none',
          apiKey: '',
          calendarId: '',
          showControls: 'true',
          allowEditing: 'false',
          startDate: '',
          endDate: '',
        };
      case 'dropdown':
        return {
          label: 'Choose an option',
          placeholder: 'Select an option',
          options: 'Option 1,Option 2,Option 3',
          multiple: 'false',
          searchable: 'false',
          required: 'false',
          dynamicOptions: 'false',
          optionsUrl: '',
          defaultValue: '',
        };
      case 'link':
        return {
          text: 'Learn More',
          url: 'https://example.com',
          openInNewTab: 'true',
          style: 'default',
          displayType: 'text',
          icon: 'LinkIcon',
          color: '#3B82F6',
        };
      case 'multi-text':
        return {
          label: 'Enter your message',
          placeholder: 'Type your text here...',
          rows: '4',
          content: '',
        };
      case 'filter':
        return {
          label: 'Filter items',
          placeholder: 'Filter items...',
          options: 'Option 1,Option 2,Option 3',
        };
      case 'alert':
        return {
          title: 'Important Information',
          message: 'This is an alert message.',
          type: 'info',
          backgroundColor: '#EFF6FF',
          textColor: '#1E3A8A',
          borderColor: '#BFDBFE',
          dismissible: 'true',
          autoClose: 'false',
          notificationType: 'inline',
        };
      case 'table':
        return {
          dataSource: 'static',
          staticData: '[]',
          dataUrl: '',
          columns: '[]',
          striped: 'true',
          hoverable: 'true',
          bordered: 'false',
          pagination: 'true',
          pageSize: '10',
          searchable: 'false',
          sortable: 'true',
          exportable: 'false',
          exportFormats: 'csv,excel',
          headerBackgroundColor: '#F8FAFC',
          headerTextColor: '#334155',
        };
      case 'searchbar':
        return {
          placeholder: 'Search...',
          searchTarget: 'widget',
          targetComponent: '',
          searchApiUrl: '',
          searchField: '',
          debounceTime: '300',
          minChars: '3',
          backgroundColor: '#FFFFFF',
          textColor: '#333333',
          borderColor: '#E2E8F0',
          width: 'full',
          showIcon: 'true',
        };
      default:
        return {};
    }
  };
  
  const handleCreateApiTemplate = () => {
    const newApiId = uuidv4();
    const newApi: ApiConfig = {
      id: newApiId,
      name: `New API ${apis.length + 1}`,
      endpoint: 'https://api.example.com/data',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      sampleResponse: JSON.stringify({
        title: 'Example API Response',
        description: 'This is a sample response from the API',
        items: [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
        ],
      }, null, 2),
      possibleFields: [
        'title',
        'description',
        'items',
        'items[0]',
        'items[0].id',
        'items[0].name',
      ],
    };
    
    setApis(prevApis => [...prevApis, newApi]);
    
    toast({
      title: "API Template Created",
      description: "A new API template has been added. You can now configure it in the API tab.",
    });
    
    setActiveTab('api');
  };
  
  const onSaveApis = (updatedApis: ApiConfig[]) => {
    setApis(updatedApis);
  };
  
  const onApplyTooltip = (componentId: string, tooltipId: string) => {
    setComponents(prevComponents =>
      prevComponents.map(comp =>
        comp.id === componentId ? { ...comp, tooltipId } : comp
      )
    );
  };
  
  const onUpdateTooltips = (updatedTooltips: CustomTooltip[]) => {
    setCustomTooltips(updatedTooltips);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-none border-b bg-background p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Widget Builder</h1>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={viewMode === 'desktop' ? 'bg-blue-50' : ''}
                    onClick={() => setViewMode('desktop')}
                  >
                    <MonitorSmartphone className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Desktop view</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={viewMode === 'mobile' ? 'bg-blue-50' : ''}
                    onClick={() => setViewMode('mobile')}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mobile view</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button>
              <Code className="h-4 w-4 mr-2" />
              Get Code
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col overflow-hidden">
        <div className="flex-none border-b">
          <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent px-4">
            <TabsTrigger value="build" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none">
              Build
            </TabsTrigger>
            <TabsTrigger value="api" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none">
              APIs
              {apis.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1 rounded-full text-xs">
                  {apis.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="tooltips" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none">
              Tooltips
              {customTooltips.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1 rounded-full text-xs">
                  {customTooltips.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-grow overflow-hidden">
          <TabsContent value="build" className="h-full m-0 data-[state=active]:flex overflow-hidden">
            <div className="flex flex-1 overflow-hidden">
              <div className="w-1/4 border-r overflow-hidden flex flex-col">
                <ComponentLibrary 
                  onAddComponent={onAddComponent} 
                  onAddMultipleComponents={onAddMultipleComponents}
                />
              </div>
              
              <div className="w-2/4 overflow-hidden flex flex-col">
                <ScrollArea className="h-full w-full">
                  <div className="p-4">
                    {components.length === 0 ? (
                      <div className="text-center p-8 border-2 border-dashed rounded-lg">
                        <FilePlus className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium">No components added yet</h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Select components from the library on the left to start building your widget.
                        </p>
                      </div>
                    ) : (
                      components.map((component) => (
                        <Card key={component.id} className="mb-4">
                          <CardContent className="p-0">
                            <ComponentEditor
                              component={component}
                              apis={apis}
                              isExpanded={expandedComponent === component.id}
                              onToggleExpand={() => onToggleExpand(component.id)}
                              onUpdateComponent={onUpdateComponent}
                              onRemoveComponent={onRemoveComponent}
                              onRequestApiTemplate={handleCreateApiTemplate}
                              onApplyTooltip={(tooltipId) => onApplyTooltip(component.id, tooltipId)}
                              disableRemove={component.type === 'header' && components.filter(c => c.type === 'header').length === 1}
                              customTooltips={customTooltips}
                            />
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
              
              <div className="w-1/4 border-l p-4 flex flex-col items-center justify-start overflow-hidden">
                <div className="text-center mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Widget Preview</h3>
                </div>
                
                <WidgetPreview components={components} apis={apis} />
                
                {components.length > 0 && components.filter(c => c.apiConfig).length === 0 && (
                  <Alert variant="warning" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No API connections</AlertTitle>
                    <AlertDescription>
                      Connect components to APIs to make your widget dynamic.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="api" className="h-full m-0">
            <ApiManager apis={apis} onSave={onSaveApis} />
          </TabsContent>
          
          <TabsContent value="tooltips" className="h-full m-0">
            <TooltipManager 
              tooltips={customTooltips} 
              onUpdate={onUpdateTooltips} 
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default WidgetBuilder;
