export type NotificationType = 'Placement' | 'Result' | 'Event';

export interface Notification {
  ID: string;
  Type: NotificationType | string;
  Message: string;
  Timestamp: string;
}

export interface NotificationAPIResponse {
  notifications: Notification[];
}
