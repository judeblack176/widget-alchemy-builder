
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
  ArrowDown,
  ArrowUpDown,
} from 'lucide-react';

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

export const ChevronDown = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

export const ChevronLeft = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

export const ChevronRight = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m9 18 6-6-6 6"/>
  </svg>
);

export const CustomArrowUpDown = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m21 16-4 4-4-4"/>
    <path d="M17 20V4"/>
    <path d="m3 8 4-4 4 4"/>
    <path d="M7 4v16"/>
  </svg>
);

// Add the ArrowUpDown component (this was missing)
export const ArrowUpDown = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m5 7 7-7 7 7"/>
    <path d="m5 17 7 7 7-7"/>
  </svg>
);
