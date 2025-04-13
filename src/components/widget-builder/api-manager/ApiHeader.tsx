
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Globe } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface ApiHeaderProps {
  onCreateSampleApi: () => void;
  setIsDialogOpen: (isOpen: boolean) => void;
}

const ApiHeader: React.FC<ApiHeaderProps> = ({ 
  onCreateSampleApi, 
  setIsDialogOpen 
}) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">APIs</h3>
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline"
          className="flex items-center gap-1"
          onClick={onCreateSampleApi}
        >
          <Globe size={16} className="inline-flex" />
          <span>Add Sample API</span>
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus size={16} className="inline-flex" />
              <span>Add API</span>
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
    </div>
  );
};

export default ApiHeader;
