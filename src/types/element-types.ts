
export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface TableColumn {
  header: string;
  accessor: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'icon';
}

export interface ContentDetails {
  size?: string;
  color?: string;
  variant?: string;
}
