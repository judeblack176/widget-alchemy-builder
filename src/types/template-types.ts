
import { WidgetComponent } from './widget-types';

export interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  components: WidgetComponent[];
}

export const DEFAULT_TEMPLATES: WidgetTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Widget',
    description: 'Start with a blank canvas',
    components: [{
      id: "header-1",
      type: "header",
      props: {
        name: "New Widget",
        icon: "Layout",
        backgroundColor: "#3B82F6",
        textColor: "#FFFFFF",
        fontFamily: "system-ui",
        bold: false,
        italic: false
      }
    }]
  },
  {
    id: 'learning-module',
    name: 'Learning Module',
    description: 'Perfect for educational content',
    components: [
      {
        id: "header-1",
        type: "header",
        props: {
          name: "Learning Module",
          icon: "BookOpen",
          backgroundColor: "#3B82F6",
          textColor: "#FFFFFF",
          fontFamily: "system-ui",
          bold: true,
          italic: false
        }
      },
      {
        id: "text-1",
        type: "text",
        props: {
          content: "Introduction to the topic",
          fontSize: "lg",
          textAlign: "left"
        }
      },
      {
        id: "video-1",
        type: "video",
        props: {
          source: "https://example.com/video.mp4",
          title: "Learning Video"
        }
      },
      {
        id: "text-2",
        type: "text",
        props: {
          content: "Key takeaways",
          fontSize: "md",
          textAlign: "left"
        }
      }
    ]
  },
  {
    id: 'data-dashboard',
    name: 'Data Dashboard',
    description: 'Display key metrics and charts',
    components: [
      {
        id: "header-1",
        type: "header",
        props: {
          name: "Dashboard Overview",
          icon: "BarChart",
          backgroundColor: "#059669",
          textColor: "#FFFFFF",
          fontFamily: "system-ui",
          bold: true,
          italic: false
        }
      },
      {
        id: "chart-1",
        type: "chart",
        props: {
          type: "bar",
          title: "Monthly Metrics"
        }
      },
      {
        id: "chart-2",
        type: "chart",
        props: {
          type: "pie",
          title: "Distribution"
        }
      }
    ]
  },
  {
    id: 'form-template',
    name: 'Form Template',
    description: 'Collect user input',
    components: [
      {
        id: "header-1",
        type: "header",
        props: {
          name: "User Information",
          icon: "FormInput",
          backgroundColor: "#7C3AED",
          textColor: "#FFFFFF",
          fontFamily: "system-ui",
          bold: true,
          italic: false
        }
      },
      {
        id: "form-1",
        type: "form",
        props: {
          label: "Personal Details",
          placeholder: "Enter your details"
        }
      },
      {
        id: "button-1",
        type: "button",
        props: {
          label: "Submit",
          variant: "default"
        }
      }
    ]
  },
  {
    id: 'calendar-view',
    name: 'Calendar View',
    description: 'Display events and schedules',
    components: [
      {
        id: "header-1",
        type: "header",
        props: {
          name: "Event Calendar",
          icon: "Calendar",
          backgroundColor: "#EA580C",
          textColor: "#FFFFFF",
          fontFamily: "system-ui",
          bold: true,
          italic: false
        }
      },
      {
        id: "calendar-1",
        type: "calendar",
        props: {
          view: "month"
        }
      }
    ]
  },
  {
    id: 'content-feed',
    name: 'Content Feed',
    description: 'Display a list of content items',
    components: [
      {
        id: "header-1",
        type: "header",
        props: {
          name: "Latest Updates",
          icon: "List",
          backgroundColor: "#DC2626",
          textColor: "#FFFFFF",
          fontFamily: "system-ui",
          bold: true,
          italic: false
        }
      },
      {
        id: "searchbar-1",
        type: "searchbar",
        props: {
          placeholder: "Search content...",
          label: "Search"
        }
      },
      {
        id: "filter-1",
        type: "filter",
        props: {
          label: "Category Filter"
        }
      },
      {
        id: "text-1",
        type: "text",
        props: {
          content: "Featured content will appear here",
          fontSize: "lg",
          textAlign: "left"
        }
      }
    ]
  }
];
