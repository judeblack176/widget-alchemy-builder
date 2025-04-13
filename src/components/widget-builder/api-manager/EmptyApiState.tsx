
import React from "react";
import { Globe } from "lucide-react";

const EmptyApiState: React.FC = () => {
  return (
    <div className="py-8 text-center text-gray-500">
      <Globe className="mx-auto text-gray-400 mb-2" size={32} />
      <p className="text-gray-500">No APIs configured yet</p>
      <p className="text-sm text-gray-400 mt-1">
        Click "Add API" to create your first API integration or "Add Sample API" to see an example
      </p>
    </div>
  );
};

export default EmptyApiState;
