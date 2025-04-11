import React from 'react';
import { WidgetComponent } from '@/types/widget-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Draggable } from 'react-beautiful-dnd';
import { 
  LayoutPanelTop, 
  Type, 
  Image, 
  Video, 
  BarChart3, 
  FormInput, 
  Calendar, 
  ListFilter, 
  Link, 
  AlignLeft, 
  AlertTriangle, 
  Table2, 
  Search, 
  ChevronDownSquare,
  Code
} from 'lucide-react';

interface ComponentLibraryProps {
  onAddComponent: (component: WidgetComponent) => void;
  existingComponents: WidgetComponent[];
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onAddComponent, existingComponents }) => {
  
  const handleAddComponent = (template: any) => {
    onAddComponent({
      id: `${template.type}-${Date.now()}`,
      type: template.type as any,
      props: template.props
    });
  };

  const componentTemplates = [
    {
      type: 'header',
      icon: <LayoutPanelTop size={18} />,
      label: 'Header',
      description: 'Top section of the widget',
      props: {
        icon: 'BookOpen',
        title: 'Learning Module'
      }
    },
    {
      type: 'text',
      icon: <Type size={18} />,
      label: 'Text',
      description: 'Display text content',
      props: {
        content: 'This is a text component.',
        size: 'medium'
      }
    },
    {
      type: 'image',
      icon: <Image size={18} />,
      label: 'Image',
      description: 'Display an image',
      props: {
        source: 'https://via.placeholder.com/150',
        altText: 'Placeholder Image'
      }
    },
    {
      type: 'button',
      icon: <ChevronDownSquare size={18} />,
      label: 'Button',
      description: 'Interactive button',
      props: {
        label: 'Click me',
        variant: 'primary'
      }
    },
    {
      type: 'video',
      icon: <Video size={18} />,
      label: 'Video',
      description: 'Embed a video',
      props: {
        source: 'https://example.com/video.mp4',
        controls: true
      }
    },
    {
      type: 'chart',
      icon: <BarChart3 size={18} />,
      label: 'Chart',
      description: 'Display data in a chart',
      props: {
        title: 'Sample Chart',
        type: 'bar',
        data: [10, 20, 30]
      }
    },
    {
      type: 'form',
      icon: <FormInput size={18} />,
      label: 'Form Input',
      description: 'User input form',
      props: {
        label: 'Enter value',
        placeholder: 'Type here...'
      }
    },
    {
      type: 'calendar',
      icon: <Calendar size={18} />,
      label: 'Calendar',
      description: 'Display a calendar',
      props: {
        label: 'Select date',
        type: 'date-picker'
      }
    },
    {
      type: 'dropdown',
      icon: <ListFilter size={18} />,
      label: 'Dropdown',
      description: 'Select from a list of options',
      props: {
        label: 'Choose option',
        options: ['Option 1', 'Option 2', 'Option 3']
      }
    },
    {
      type: 'link',
      icon: <Link size={18} />,
      label: 'Link',
      description: 'A hyperlink',
      props: {
        text: 'Click here',
        url: 'https://example.com'
      }
    },
    {
      type: 'multi-text',
      icon: <AlignLeft size={18} />,
      label: 'Multi-line Text',
      description: 'Multi-line text input',
      props: {
        label: 'Enter text',
        placeholder: 'Type multiple lines...'
      }
    },
    {
      type: 'filter',
      icon: <Search size={18} />,
      label: 'Filter',
      description: 'Filter items',
      props: {
        label: 'Filter items',
        placeholder: 'Enter filter text...'
      }
    },
    {
      type: 'alert',
      icon: <AlertTriangle size={18} />,
      label: 'Alert',
      description: 'Display an alert message',
      props: {
        title: 'Alert!',
        message: 'This is an alert message.',
        type: 'warning'
      }
    },
    {
      type: 'table',
      icon: <Table2 size={18} />,
      label: 'Table',
      description: 'Display data in a table',
      props: {
        columns: [{ header: 'Name', accessor: 'name' }, { header: 'Age', accessor: 'age' }],
        data: [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }]
      }
    },
    {
      type: 'searchbar',
      icon: <Search size={18} />,
      label: 'Search Bar',
      description: 'A search bar component',
      props: {
        placeholder: 'Search...',
        searchTarget: 'all'
      }
    },
    {
      type: 'code',
      icon: <Code size={18} />,
      label: 'Code',
      description: 'Custom code execution',
      props: {
        title: 'Custom Code',
        content: '// Add your custom code here\nconsole.log("Hello, world!");',
        language: 'javascript',
        darkMode: true,
        executionEnabled: true,
        maxHeight: '200px',
        description: 'Use this component to add custom JavaScript code'
      }
    }
  ];

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-4">
        <h3 className="font-medium text-sm">Available Components</h3>
        <div className="grid grid-cols-1 gap-3">
          {componentTemplates.map((template, index) => {
            const isHeaderComponentDisabled = template.type === 'header' && existingComponents.some(c => c.type === 'header');
            const isAlertComponentDisabled = template.type === 'alert' && existingComponents.some(c => c.type === 'alert');
            const isDisabled = isHeaderComponentDisabled || isAlertComponentDisabled;
            
            return (
              <Draggable 
                key={template.type} 
                draggableId={template.type} 
                index={index}
                isDragDisabled={isDisabled}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    data-component-type={template.type}
                  >
                    <Card 
                      className={`cursor-pointer hover:border-blue-500 transition-colors overflow-hidden ${isDisabled ? 'opacity-50' : ''}`}
                      onClick={() => {
                        if (!isDisabled) {
                          onAddComponent({
                            id: `${template.type}-${Date.now()}`,
                            type: template.type as any,
                            props: template.props
                          });
                        }
                      }}
                    >
                      <CardContent className="p-3 flex items-center gap-3">
                        <div className="flex-shrink-0 p-2 bg-blue-50 rounded-md text-blue-500">
                          {template.icon}
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium text-gray-900">{template.label}</h4>
                          <p className="text-sm text-gray-500 truncate">{template.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </Draggable>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
};

export default ComponentLibrary;
