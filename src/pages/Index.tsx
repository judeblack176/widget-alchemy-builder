
import React, { useState } from "react";
import { Link } from "react-router-dom";
import WidgetBuilder from "@/components/widget-builder/WidgetBuilder";
import { Button } from "@/components/ui/button";
import { LibraryBig, ShieldCheck, Tag } from "lucide-react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";

interface IndexProps {
  onTagManagerOpen: () => void;
}

const Index: React.FC<IndexProps> = ({ onTagManagerOpen }) => {
  // Initialize empty arrays for components and APIs
  const [components, setComponents] = useState<WidgetComponent[]>([]);
  const [apis, setApis] = useState<ApiConfig[]>([]);

  // Handler functions for WidgetBuilder
  const handleUpdateComponent = (updatedComponent: WidgetComponent) => {
    setComponents(prevComponents =>
      prevComponents.map(comp => 
        comp.id === updatedComponent.id ? updatedComponent : comp
      )
    );
  };

  const handleRemoveComponent = (componentId: string) => {
    setComponents(prevComponents => 
      prevComponents.filter(comp => comp.id !== componentId)
    );
  };

  const handleReorderComponents = (reorderedComponents: WidgetComponent[]) => {
    setComponents(reorderedComponents);
  };

  const handleRequestApiTemplate = (componentId: string) => {
    console.log("API template requested for component:", componentId);
    // Implement API template request logic here
  };

  const handleApplyTooltip = (componentId: string, tooltipId: string) => {
    setComponents(prevComponents =>
      prevComponents.map(comp => 
        comp.id === componentId ? { ...comp, tooltipId } : comp
      )
    );
  };

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
        <WidgetBuilder 
          components={components}
          apis={apis}
          onUpdateComponent={handleUpdateComponent}
          onRemoveComponent={handleRemoveComponent}
          onReorderComponents={handleReorderComponents}
          onRequestApiTemplate={handleRequestApiTemplate}
          onApplyTooltip={handleApplyTooltip}
        />
      </div>
    </div>
  );
};

export default Index;
