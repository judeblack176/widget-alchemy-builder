
import { WidgetTemplate } from './base-template-types';

export const formTemplate: WidgetTemplate = {
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
};
