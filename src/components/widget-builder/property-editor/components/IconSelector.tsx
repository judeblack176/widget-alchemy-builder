
import React from "react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Library,
  Bell,
  Bookmark,
  FileText,
  User,
  Info,
  Globe,
  Home,
  Mail,
  Map,
  Phone,
  ShoppingBag,
  Star,
  Coffee
} from 'lucide-react';

interface IconSelectorProps {
  value: string;
  label: string;
  onChange: (value: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({
  value,
  label,
  onChange
}) => {
  const availableIcons = [
    { name: "BookOpen", component: <BookOpen size={18} /> },
    { name: "Library", component: <Library size={18} /> },
    { name: "Bell", component: <Bell size={18} /> },
    { name: "Bookmark", component: <Bookmark size={18} /> },
    { name: "FileText", component: <FileText size={18} /> },
    { name: "User", component: <User size={18} /> },
    { name: "Info", component: <Info size={18} /> },
    { name: "Globe", component: <Globe size={18} /> },
    { name: "Home", component: <Home size={18} /> },
    { name: "Mail", component: <Mail size={18} /> },
    { name: "Map", component: <Map size={18} /> },
    { name: "Phone", component: <Phone size={18} /> },
    { name: "ShoppingBag", component: <ShoppingBag size={18} /> },
    { name: "Star", component: <Star size={18} /> },
    { name: "Coffee", component: <Coffee size={18} /> }
  ];

  return (
    <div className="mb-4">
      <Label htmlFor={`prop-icon`}>{label}</Label>
      <ScrollArea className="h-[180px] border rounded-md p-2 mt-1">
        <div className="grid grid-cols-5 gap-2">
          {availableIcons.map((icon) => (
            <div
              key={icon.name}
              className={`flex flex-col items-center justify-center p-2 border rounded cursor-pointer hover:bg-gray-100 ${
                value === icon.name ? "bg-blue-100 border-blue-300" : ""
              }`}
              onClick={() => onChange(icon.name)}
            >
              {icon.component}
              <span className="text-xs mt-1 text-center">{icon.name}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default IconSelector;
