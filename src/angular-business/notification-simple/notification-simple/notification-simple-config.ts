import { AriaLivePoliteness } from '@angular/cdk/a11y';
import { ViewContainerRef } from '@angular/core';

/** Possible values for horizontalPosition on NotificationSimpleConfig. */
export type NotificationHorizontalPosition = 'center';

/** Possible values for verticalPosition on NotificationSimpleConfig. */
export type NotificationVerticalPosition = 'top' | 'bottom';

export class NotificationSimpleConfig<D = any> {
  /** The politeness level for the AriaLiveAnnouncer announcement. */
  politeness?: AriaLivePoliteness = 'assertive';

  /**
   * Message to be announced by the LiveAnnouncer. When opening a notification without a custom
   * component or template, the announcement message will default to the specified message.
   */
  announcementMessage?: string;

  /** The length of time in milliseconds to wait before automatically dismissing the notification. */
  duration?: number = 0;

  /**
   * The view container that serves as the parent for the notification for the purposes of dependency
   * injection. Note: this does not affect where the notification is inserted in the DOM.
   */
  viewContainerRef?: ViewContainerRef;

  /** Extra CSS classes to be added to the notification container. */
  panelClass?: string | string[];

  /** Possible values for the notification's vertical position. */
  verticalPosition?: NotificationVerticalPosition = 'bottom';

  /** Type, used for styling purposes, of the notification */
  type?: 'success' | 'error' | 'warn' | 'info' = 'success';
}
