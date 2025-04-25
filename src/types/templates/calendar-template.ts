
import { WidgetTemplate } from './base-template-types';

export const calendarTemplate: WidgetTemplate = {
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
};
