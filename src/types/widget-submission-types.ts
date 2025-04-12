
import { WidgetConfig } from './widget-config-types';
import { WidgetApprovalStatus } from './base-types';

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
