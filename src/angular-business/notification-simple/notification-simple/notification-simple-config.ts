import { TemplateRef, ViewContainerRef } from '@angular/core';

import { JumpMark } from './notification-simple.component';

/** Possible values for horizontalPosition on NotificationSimpleConfig. */
export type NotificationHorizontalPosition = 'center';

/** Possible values for verticalPosition on NotificationSimpleConfig. */
export type NotificationVerticalPosition = 'top' | 'bottom';

export class NotificationSimpleConfig<D = any> {
  /**
   * The view container that serves as the parent for the notification for the purposes of dependency
   * injection. Note: this does not affect where the notification is inserted in the DOM.
   */
  viewContainerRef?: ViewContainerRef;

  /** Extra CSS classes to be added to the notification container. */
  panelClass?: string | string[];

  /** Message to be displayed inside the notification. */
  message?: string;

  /** Possible values for the notification's vertical position. */
  verticalPosition?: NotificationVerticalPosition = 'bottom';

  /** Type, used for styling purposes, of the notification */
  type?: 'success' | 'error' | 'warn' | 'info' = 'success';

  /** List of jumpmarks to be displayed in the notification */
  jumpMarks?: JumpMark[];

  /** Custom icon to be displayed in the notification */
  icon?: TemplateRef<any> | null;

  /** Readonly determines whether the notification is closable or not */
  readonly?: boolean = true;
}
