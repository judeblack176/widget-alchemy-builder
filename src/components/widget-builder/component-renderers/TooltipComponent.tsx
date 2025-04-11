import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

interface TooltipComponentProps {
  children?: React.ReactNode;
  triggerText?: string;
  content: string;
  placement?: "top" | "right" | "bottom" | "left";
  backgroundColor?: string;
  textColor?: string;
  showArrow?: boolean;
  triggerStyle?: "button" | "text" | "icon" | "custom";
}

const TooltipComponent: React.FC<TooltipComponentProps> = ({
  children,
  triggerText = "Hover me",
  content = "Tooltip content",
  placement = "top",
  backgroundColor = "#1E293B",
  textColor = "#FFFFFF",
  showArrow = true,
  triggerStyle = "button"
}) => {
  // Convert placement to side for Radix UI
  const side = placement as "top" | "right" | "bottom" | "left";
  
  // Prepare custom styles for tooltip content
  const customStyles = {
    backgroundColor,
    color: textColor,
  };

  const renderTrigger = () => {
    // If children are provided, use them as the trigger
    if (children) {
      return children;
    }

    // Otherwise, use the default trigger based on triggerStyle
    switch (triggerStyle) {
      case "button":
        return <Button variant="outline" size="sm">{triggerText}</Button>;
      case "icon":
        return <HelpCircle className="cursor-help" size={20} />;
      case "text":
        return <span className="underline cursor-help">{triggerText}</span>;
      case "custom":
      default:
        return <span className="border-b border-dotted cursor-help">{triggerText}</span>;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip defaultOpen={false} delayDuration={200}>
        <TooltipTrigger asChild>
          {renderTrigger()}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          style={customStyles}
          className="max-w-xs"
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipComponent;
