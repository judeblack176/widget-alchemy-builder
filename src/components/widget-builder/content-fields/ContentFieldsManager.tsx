
import React, { useState, useRef, useEffect } from "react";
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
import { 
  ChevronDown,
  Bold, 
  Italic, 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ContentFieldsManagerProps {
  component: WidgetComponent;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
}

const ContentFieldsManager: React.FC<ContentFieldsManagerProps> = ({
  component,
  onUpdateComponent
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedText, setSelectedText] = useState<{start: number, end: number} | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Handle selection in the textarea
  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    if (target.selectionStart !== target.selectionEnd) {
      setSelectedText({
        start: target.selectionStart,
        end: target.selectionEnd
      });
    } else {
      setSelectedText(null);
    }
  };

  // Apply formatting to selected text
  const applyFormatting = (format: string, value: string) => {
    if (!selectedText || !textareaRef.current) return;
    
    const content = component.formattedContent || "";
    const beforeSelection = content.substring(0, selectedText.start);
    const selection = content.substring(selectedText.start, selectedText.end);
    const afterSelection = content.substring(selectedText.end);
    
    // Create formatting tag
    const formattedText = `<span class="${format}-${value}">${selection}</span>`;
    const newContent = beforeSelection + formattedText + afterSelection;
    
    handleFormattedContentChange(newContent);
    
    // Reset selection after applying format
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = beforeSelection.length + formattedText.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
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
        <div className="mb-2 flex flex-wrap gap-1 border-b pb-2">
          <Label className="w-full text-xs mb-1">Formatting Toolbar</Label>
          <div className="flex flex-wrap gap-1 w-full">
            <ToggleGroup type="single" className="justify-start" onValueChange={(val) => val && applyFormatting("size", val)}>
              <ToggleGroupItem value="small" size="sm" disabled={!selectedText}>
                <Type size={12} />
              </ToggleGroupItem>
              <ToggleGroupItem value="medium" size="sm" disabled={!selectedText}>
                <Type size={16} />
              </ToggleGroupItem>
              <ToggleGroupItem value="large" size="sm" disabled={!selectedText}>
                <Type size={20} />
              </ToggleGroupItem>
            </ToggleGroup>
            
            <div className="border-r h-8 mx-1"></div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0" 
              onClick={() => selectedText && applyFormatting("weight", "bold")}
              disabled={!selectedText}
            >
              <Bold size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0" 
              onClick={() => selectedText && applyFormatting("style", "italic")}
              disabled={!selectedText}
            >
              <Italic size={16} />
            </Button>
            
            <div className="border-r h-8 mx-1"></div>
            
            <ToggleGroup type="single" className="justify-start" onValueChange={(val) => val && applyFormatting("align", val)}>
              <ToggleGroupItem value="left" size="sm" disabled={!selectedText}>
                <AlignLeft size={16} />
              </ToggleGroupItem>
              <ToggleGroupItem value="center" size="sm" disabled={!selectedText}>
                <AlignCenter size={16} />
              </ToggleGroupItem>
              <ToggleGroupItem value="right" size="sm" disabled={!selectedText}>
                <AlignRight size={16} />
              </ToggleGroupItem>
            </ToggleGroup>
            
            <div className="border-r h-8 mx-1"></div>
            
            <Select 
              value="" 
              onValueChange={(val) => selectedText && applyFormatting("color", val)}
              disabled={!selectedText}
            >
              <div onClick={handleInputClick}>
                <SelectTrigger className="h-7 text-xs w-[100px]" onClick={handleInputClick}>
                  <SelectValue placeholder="Text color" />
                </SelectTrigger>
                <SelectContent onClick={handleInputClick}>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="muted">Muted</SelectItem>
                  <SelectItem value="accent">Accent</SelectItem>
                </SelectContent>
              </div>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground mt-1 w-full">
            {selectedText ? "Select formatting to apply to text" : "Select text to format it"}
          </p>
        </div>
        
        <Textarea
          ref={textareaRef}
          className="w-full h-32 border rounded p-2 text-sm"
          value={component.formattedContent || ""}
          onChange={(e) => handleFormattedContentChange(e.target.value)}
          placeholder="Enter formatted content or use API fields..."
          onClick={handleInputClick}
          onFocus={handleInputFocus}
          onSelect={handleTextareaSelect}
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
                    <div onClick={handleInputClick}>
                      <Select
                        value={component.props?.[option.name]?.toString() || ""}
                        onValueChange={(val) => handlePropertyChange(option.name, val)}
                      >
                        <SelectTrigger id={`prop-${option.name}`} className="h-8 text-xs" onClick={handleInputClick}>
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
