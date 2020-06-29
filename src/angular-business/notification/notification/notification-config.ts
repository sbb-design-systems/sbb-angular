import { TemplateRef, ViewContainerRef } from '@angular/core';

import { NotificationType } from '../notification-container/notification-container.component';

import { JumpMark } from './notification.component';

/** Possible values for horizontalPosition on NotificationConfig. */
export type NotificationHorizontalPosition = 'center';

/** Possible values for verticalPosition on NotificationConfig. */
export type NotificationVerticalPosition = 'top' | 'bottom';

export class NotificationConfig<D = any> {
  viewContainerRef?: ViewContainerRef;

  panelClass?: string | string[];

  message?: string;

  verticalPosition?: NotificationVerticalPosition = 'bottom';

  type?: NotificationType = NotificationType.SUCCESS;

  jumpMarks?: JumpMark[];

  icon?: TemplateRef<any> | null;

  readonly?: boolean;
}
