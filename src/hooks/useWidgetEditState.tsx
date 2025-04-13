
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useWidgetEditState = (widgetId: string | null) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (widgetId) {
      setIsEditing(true);
    }
  }, [widgetId]);

  return {
    isEditing,
    setIsEditing
  };
};
