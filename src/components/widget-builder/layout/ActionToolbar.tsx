
import React from 'react';
import { useWidget } from '@/contexts/WidgetContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, ChevronDown, Library, X } from 'lucide-react';

interface ActionToolbarProps {
  title: string;
}

const ActionToolbar: React.FC<ActionToolbarProps> = ({ title }) => {
  const { isEditing, setIsEditing, setWidgetComponents, setApis } = useWidget();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNewWidget = () => {
    setWidgetComponents([{
      id: "header-1",
      type: "header",
      props: {
        icon: "BookOpen",
        title: "Learning Module",
        actions: ["Edit", "More"]
      }
    }]);
    setApis([]);
    setIsEditing(false);
    
    navigate('/');
    
    toast({
      title: "New Widget Started",
      description: "You can now start building a new widget from scratch."
    });
  };

  const handleLoadWidget = () => {
    navigate('/library?mode=select');
    setIsEditing(false);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    navigate('/');
    toast({
      title: "Editing Cancelled",
      description: "Changes to the widget have been discarded."
    });
  };

  const handleSaveWidget = () => {
    toast({
      title: "Widget Saved",
      description: "Your widget configuration has been saved."
    });
  };

  return (
    <div className="sticky top-0 z-40 bg-widget-gray p-4 border-b border-gray-200">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="space-x-2">
          <DropdownMenu>
            <Button
              asChild
              variant="default"
              size="default"
              className="bg-widget-blue hover:bg-blue-600 transition-colors"
            >
              <DropdownMenuTrigger>
                <Plus size={16} className="mr-2" /> Add New Widget
                <ChevronDown size={16} className="ml-2" />
              </DropdownMenuTrigger>
            </Button>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleNewWidget}>
                <Plus size={16} className="mr-2" /> 
                Create New Widget
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLoadWidget}>
                <Library size={16} className="mr-2" /> 
                Load from Widget Library
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default ActionToolbar;
