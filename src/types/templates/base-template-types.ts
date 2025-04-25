
import { WidgetComponent } from '../widget-types';

export interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  components: WidgetComponent[];
}
