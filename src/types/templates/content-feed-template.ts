
import { WidgetTemplate } from './base-template-types';

export const contentFeedTemplate: WidgetTemplate = {
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
};
