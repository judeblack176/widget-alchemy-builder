
import React from 'react';
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
  Coffee,
  LinkIcon,
  ExternalLink,
  Download,
  ArrowDown
} from 'lucide-react';

import { ChevronDown, ChevronLeft, ChevronRight } from './icons/ChevronIcons';
import { CustomArrowUpDown, ArrowUpDown } from './icons/ArrowIcons';

export const getIconByName = (iconName: string) => {
  switch (iconName) {
    case 'BookOpen': return <BookOpen className="mr-4 flex-shrink-0" />;
    case 'Library': return <Library className="mr-4 flex-shrink-0" />;
    case 'Bell': return <Bell className="mr-4 flex-shrink-0" />;
    case 'Bookmark': return <Bookmark className="mr-4 flex-shrink-0" />;
    case 'FileText': return <FileText className="mr-4 flex-shrink-0" />;
    case 'User': return <User className="mr-4 flex-shrink-0" />;
    case 'Info': return <Info className="mr-4 flex-shrink-0" />;
    case 'Globe': return <Globe className="mr-4 flex-shrink-0" />;
    case 'Home': return <Home className="mr-4 flex-shrink-0" />;
    case 'Mail': return <Mail className="mr-4 flex-shrink-0" />;
    case 'Map': return <Map className="mr-4 flex-shrink-0" />;
    case 'Phone': return <Phone className="mr-4 flex-shrink-0" />;
    case 'ShoppingBag': return <ShoppingBag className="mr-4 flex-shrink-0" />;
    case 'Star': return <Star className="mr-4 flex-shrink-0" />;
    case 'Coffee': return <Coffee className="mr-4 flex-shrink-0" />;
    default: return <BookOpen className="mr-4 flex-shrink-0" />;
  }
};

export const getLinkIcon = (iconName: string) => {
  switch (iconName) {
    case 'LinkIcon': return <LinkIcon size={16} className="mr-1" />;
    case 'ExternalLink': return <ExternalLink size={16} className="mr-1" />;
    case 'FileText': return <FileText size={16} className="mr-1" />;
    case 'Download': return <Download size={16} className="mr-1" />;
    case 'Info': return <Info size={16} className="mr-1" />;
    default: return null;
  }
};

// Re-export the icon components
export { ChevronDown, ChevronLeft, ChevronRight, CustomArrowUpDown, ArrowUpDown };
