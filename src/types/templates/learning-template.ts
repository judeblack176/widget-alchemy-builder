
import { WidgetTemplate } from './base-template-types';

export const learningTemplate: WidgetTemplate = {
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
};
