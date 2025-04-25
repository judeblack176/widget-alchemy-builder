
import { WidgetTemplate } from './base-template-types';
import { blankTemplate } from './blank-template';
import { learningTemplate } from './learning-template';
import { dashboardTemplate } from './dashboard-template';
import { formTemplate } from './form-template';
import { calendarTemplate } from './calendar-template';
import { contentFeedTemplate } from './content-feed-template';

export const DEFAULT_TEMPLATES: WidgetTemplate[] = [
  blankTemplate,
  learningTemplate,
  dashboardTemplate,
  formTemplate,
  calendarTemplate,
  contentFeedTemplate
];

export * from './base-template-types';
