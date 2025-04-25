
import { WidgetTemplate } from './base-template-types';

export const blankTemplate: WidgetTemplate = {
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
};
