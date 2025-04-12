
export type CalendarServiceType = 'google' | 'outlook' | 'apple' | 'custom' | 'none';

export interface CalendarIntegrationConfig {
  serviceType: CalendarServiceType;
  apiKey?: string;
  calendarId?: string;
  syncEnabled: boolean;
}

export interface ICSConfig {
  enabled: boolean;
  importEnabled?: boolean;
  exportEnabled?: boolean;
  allowSubscribe?: boolean;
  icsUrl?: string;
  syncInterval?: 'hourly' | 'daily' | 'weekly' | 'never';
}
