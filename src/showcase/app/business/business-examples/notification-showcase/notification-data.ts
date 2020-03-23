import { JumpMark, NotificationType } from '@sbb-esta/angular-business/notification';

export const NOTIFICATION_TYPES = [
  NotificationType.SUCCESS,
  NotificationType.INFO,
  NotificationType.ERROR,
  NotificationType.WARN
];

export const JUMPMARKS: JumpMark[] = [
  { elementId: '#tip1', title: 'Tip 1' },
  { elementId: '#tip2', title: 'Tip 2' }
];
