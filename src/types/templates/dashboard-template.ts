
import { WidgetTemplate } from './base-template-types';

export const dashboardTemplate: WidgetTemplate = {
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
};
