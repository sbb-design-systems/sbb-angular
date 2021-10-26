import { AriaLivePoliteness } from '@angular/cdk/a11y';
import { InjectionToken, ViewContainerRef } from '@angular/core';
import { SbbNotificationType } from '@sbb-esta/angular/notification';

/** Injection token that can be used to access the data that was passed into a notification toast. */
export const SBB_NOTIFICATION_TOAST_DATA = new InjectionToken<any>('SbbNotificationToastData');

/** Possible values for verticalPosition on SbbNotificationToastConfig. */
export type SbbNotificationToastVerticalPosition = 'top' | 'bottom';

export class SbbNotificationToastConfig<D = any> {
  /** The politeness level for the AriaLiveAnnouncer announcement. */
  politeness?: AriaLivePoliteness = 'assertive';

  /**
   * Message to be announced by the LiveAnnouncer. When opening a notification without a custom
   * component or template, the announcement message will default to the specified message.
   */
  announcementMessage?: string;

  /**
   * The view container that serves as the parent for the notification for the purposes of dependency
   * injection. Note: this does not affect where the notification is inserted in the DOM.
   */
  viewContainerRef?: ViewContainerRef;

  /** The length of time in milliseconds to wait before automatically dismissing the notification. */
  duration?: number = 0;

  /** Extra CSS classes to be added to the notification container. */
  panelClass?: string | string[];

  /** Data being injected into the child component. */
  data?: D | null = null;

  /** Possible values for the notification's vertical position. */
  verticalPosition?: SbbNotificationToastVerticalPosition = 'bottom';

  /** The notification type */
  type?: SbbNotificationType = 'success';
}
