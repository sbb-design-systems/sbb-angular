import { TemplateRef, ViewContainerRef } from '@angular/core';

import { NotificationType } from '../notification-simple-container/notification-simple-container.component';

import { JumpMark } from './notification-simple.component';

/** Possible values for horizontalPosition on NotificationSimpleConfig. */
export type NotificationHorizontalPosition = 'center';

/** Possible values for verticalPosition on NotificationSimpleConfig. */
export type NotificationVerticalPosition = 'top' | 'bottom';

export class NotificationSimpleConfig<D = any> {
  viewContainerRef?: ViewContainerRef;

  panelClass?: string | string[];

  message?: string;

  verticalPosition?: NotificationVerticalPosition = 'bottom';

  type?: NotificationType = NotificationType.SUCCESS;

  jumpMarks?: JumpMark[];

  icon?: TemplateRef<any> | null;

  readonly?: boolean;
}
