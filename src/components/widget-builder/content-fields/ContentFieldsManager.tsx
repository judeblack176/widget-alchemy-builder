
import React, { useState } from "react";
import { WidgetComponent } from "@/types/widget-types";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { ChevronDown, Bold, Italic, Type, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContentFieldsManagerProps {
  component: WidgetComponent;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
}

const ContentFieldsManager: React.FC<ContentFieldsManagerProps> = ({
  component,
  onUpdateComponent
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleFormattedContentChange = (value: string) => {
    const updatedComponent = {
      ...component,
      formattedContent: value
    };
    onUpdateComponent(updatedComponent);
  };

  const handlePropertyChange = (propertyName: string, value: any) => {
    const updatedComponent = {
      ...component,
      props: {
        ...component.props,
        [propertyName]: value,
      },
    };
    onUpdateComponent(updatedComponent);
  };

  // Stop propagation on input interactions to prevent container from closing
  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Handle focus events separately with the correct event type
  const handleInputFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
  };

  const textOptions = [
    { name: "size", label: "Text Size", type: "select", options: ["small", "medium", "large"] },
    { name: "color", label: "Text Color", type: "select", options: ["default", "primary", "secondary", "muted", "accent"] },
    { name: "bold", label: "Bold", type: "select", options: ["true", "false"] },
    { name: "italic", label: "Italic", type: "select", options: ["true", "false"] },
    { name: "alignment", label: "Alignment", type: "select", options: ["left", "center", "right"] }
  ];

  // Ensure we always render the content editor even if there are no content fields yet
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Formatted Content</h3>
      <div className="border rounded-md p-3 bg-gray-50">
        <Textarea
          className="w-full h-32 border rounded p-2 text-sm"
          value={component.formattedContent || ""}
          onChange={(e) => handleFormattedContentChange(e.target.value)}
          placeholder="Enter formatted content or use API fields..."
          onClick={handleInputClick}
          onFocus={handleInputFocus}
        />
        
        <Accordion 
          type="single" 
          collapsible 
          className="mt-3"
          onClick={handleInputClick}
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
                    <Select
                      value={component.props?.[option.name]?.toString() || ""}
                      onValueChange={(val) => handlePropertyChange(option.name, val)}
                      onClick={handleInputClick}
                    >
                      <SelectTrigger id={`prop-${option.name}`} className="h-8 text-xs">
                        <SelectValue placeholder={`Select ${option.label}`} />
                      </SelectTrigger>
                      <SelectContent onClick={handleInputClick}>
                        {option.options.map((opt) => (
                          <SelectItem key={opt} value={opt} className="text-xs">
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {component.contentFields && component.contentFields.length > 0 && (
          <div className="mt-3" onClick={handleInputClick}>
            <Label className="text-xs font-medium mb-1 block">Available API Fields</Label>
            <div className="flex flex-wrap gap-2">
              {component.contentFields.map((field, idx) => (
                <Badge 
                  key={idx} 
                  variant="outline" 
                  className="text-xs cursor-pointer hover:bg-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    const placeholder = `{{${field.label}}}`;
                    const currentContent = component.formattedContent || "";
                    handleFormattedContentChange(currentContent + placeholder);
                  }}
                >
                  {field.label} 
                  <span className="text-gray-500 ml-1">({field.apiField})</span>
                  {field.mapping && (
                    <span className="text-green-600 ml-1">→ {field.mapping}</span>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentFieldsManager;
