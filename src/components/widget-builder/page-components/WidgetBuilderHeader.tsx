
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Library, User } from 'lucide-react';

interface WidgetBuilderHeaderProps {
  onLoadWidget: () => void;
  onNewWidget: () => void;
}

const WidgetBuilderHeader: React.FC<WidgetBuilderHeaderProps> = ({
  onLoadWidget,
  onNewWidget
}) => {
  return (
    <header className="bg-white border-b border-gray-200 p-4 w-full sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-widget-blue">EdTech Widget Builder</h1>
        <div className="flex space-x-2">
          <Link to="/library">
            <Button variant="outline" className="mr-2">
              <Library size={16} className="mr-2" /> Widget Library
            </Button>
          </Link>
          <Link to="/admin/login">
            <Button variant="outline">
              <User size={16} className="mr-2" /> Admin
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default WidgetBuilderHeader;
