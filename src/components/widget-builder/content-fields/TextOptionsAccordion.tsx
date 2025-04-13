
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { WidgetComponent } from "@/types/widget-types";

interface TextOptionsAccordionProps {
  component: WidgetComponent;
  onPropertyChange: (propertyName: string, value: any) => void;
  onInputClick: (e: React.MouseEvent) => void;
}

const TextOptionsAccordion: React.FC<TextOptionsAccordionProps> = ({
  component,
  onPropertyChange,
  onInputClick
}) => {
  const textOptions = [
    { name: "size", label: "Text Size", type: "select", options: ["small", "medium", "large"] },
    { name: "color", label: "Text Color", type: "select", options: ["default", "primary", "secondary", "muted", "accent"] },
    { name: "bold", label: "Bold", type: "select", options: ["true", "false"] },
    { name: "italic", label: "Italic", type: "select", options: ["true", "false"] },
    { name: "alignment", label: "Alignment", type: "select", options: ["left", "center", "right"] }
  ];

  return (
    <Accordion 
      type="single" 
      collapsible 
      className="mt-3"
      onClick={onInputClick}
    >
      <AccordionItem value="text-options" className="border-b-0">
        <AccordionTrigger className="py-2 text-sm">
          Text Options
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-2 gap-3">
            {textOptions.map((option) => (
              <div key={option.name} className="mb-2">
                <Label htmlFor={`prop-${option.name}`} className="text-xs mb-1 block">{option.label}</Label>
                <div onClick={onInputClick}>
                  <Select
                    value={component.props?.[option.name]?.toString() || ""}
                    onValueChange={(val) => onPropertyChange(option.name, val)}
                  >
                    <SelectTrigger id={`prop-${option.name}`} className="h-8 text-xs" onClick={onInputClick}>
                      <SelectValue placeholder={`Select ${option.label}`} />
                    </SelectTrigger>
                    <SelectContent onClick={onInputClick}>
                      {option.options.map((opt) => (
                        <SelectItem key={opt} value={opt} className="text-xs">
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default TextOptionsAccordion;
