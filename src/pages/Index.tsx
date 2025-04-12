
import React from "react";
import { Link } from "react-router-dom";
import WidgetBuilder from "@/components/widget-builder/WidgetBuilder";
import { Button } from "@/components/ui/button";
import { LibraryBig, ShieldCheck, Tag } from "lucide-react";

interface IndexProps {
  onTagManagerOpen: () => void;
}

const Index: React.FC<IndexProps> = ({ onTagManagerOpen }) => {
  return (
    <div className="h-screen flex flex-col">
      <header className="border-b border-gray-200 py-4 px-6 bg-white flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Widget Builder</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={onTagManagerOpen} 
            className="gap-2"
          >
            <Tag size={16} />
            Tags
          </Button>
          <Link to="/library">
            <Button variant="outline" className="gap-2">
              <LibraryBig size={16} />
              Widget Library
            </Button>
          </Link>
          <Link to="/admin/login">
            <Button variant="secondary" className="gap-2">
              <ShieldCheck size={16} />
              Admin
            </Button>
          </Link>
        </div>
      </header>
      <div className="flex-1 overflow-auto">
        <WidgetBuilder />
      </div>
    </div>
  );
};

export default Index;
