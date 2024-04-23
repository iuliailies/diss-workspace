export enum NotificationType {
  error = 'error',
  success = 'success',
  warning = 'warning',
  highlight = 'highlight',
}

export interface INotification {
  id?: number;
  message: string;
  type: NotificationType;
  lifetime?: number;
}
