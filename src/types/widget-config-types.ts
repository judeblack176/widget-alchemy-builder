
import { WidgetComponent } from './component-types';
import { ApiConfig } from './api-types';

export interface WidgetConfig {
  components: WidgetComponent[];
  apis: ApiConfig[];
}
