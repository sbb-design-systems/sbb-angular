import {
  JumpMark,
  NotificationToastPosition,
  NotificationType
} from '@sbb-esta/angular-business/notification';

export const NOTIFICATION_TYPES = [
  NotificationType.SUCCESS,
  NotificationType.INFO,
  NotificationType.ERROR,
  NotificationType.WARN
];

export const TOAST_POSITIONS = [
  NotificationToastPosition.TOPLEFT,
  NotificationToastPosition.TOPRIGHT,
  NotificationToastPosition.BOTTOMLEFT,
  NotificationToastPosition.BOTTOMRIGHT
];

export const JUMPMARKS: JumpMark[] = [
  { elementId: '#tip1', title: 'Tip 1' },
  { elementId: '#tip2', title: 'Tip 2' }
];
