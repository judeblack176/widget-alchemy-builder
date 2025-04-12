
import React from 'react';
import { useWidget } from '@/contexts/WidgetContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const PreviewToolbar: React.FC = () => {
  const { isEditing, setIsEditing, widgetComponents, apis, tooltips } = useWidget();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCancelEditing = () => {
    setIsEditing(false);
    navigate('/');
    toast({
      title: "Editing Cancelled",
      description: "Changes to the widget have been discarded."
    });
  };

  const handleSaveWidget = () => {
    const widgetConfig = {
      components: widgetComponents,
      apis: apis,
      tooltips: tooltips
    };
    
    localStorage.setItem('savedWidget', JSON.stringify(widgetConfig));
    
    toast({
      title: "Widget Saved",
      description: "Your widget configuration has been saved."
    });
  };

  return (
    <div className="sticky top-0 z-40 bg-gray-200 p-4 border-b border-gray-300">
      <div className="flex justify-between items-center self-stretch mb-6">
        <h2 className="text-xl font-semibold">Preview</h2>
        <div className="space-x-2">
          {isEditing && (
            <Button
              onClick={handleCancelEditing}
              variant="outline"
              size="default"
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              <X size={16} className="mr-2" /> Cancel
            </Button>
          )}
          <Button
            onClick={handleSaveWidget}
            variant="default"
            size="default"
            className="bg-green-500 hover:bg-green-600 transition-colors"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewToolbar;
