
import { WidgetComponent } from './component-types';
import { ApiConfig } from './api-types';

export type WidgetApprovalStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface WidgetConfig {
  components: WidgetComponent[];
  apis: ApiConfig[];
}

export interface WidgetSubmission {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: WidgetApprovalStatus;
  feedback?: string;
  config: WidgetConfig;
  thumbnail?: string;
  author: string;
  category?: string;
  tags?: string[];
  version: string;
}
