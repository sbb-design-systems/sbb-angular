import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';

import { SBB_NOTIFICATION_TOAST_DATA } from './notification-toast-config';
import { SbbNotificationToastRef } from './notification-toast-ref';

/** Interface for a simple notification toast component that has a message and a single action. */
export interface SbbTextOnlyNotificationToast {
  data: { message: string };
  notificationToastRef: SbbNotificationToastRef<SbbTextOnlyNotificationToast>;
}

/**
 * A component used to open as the default notification toast, matching digital.sbb.ch spec.
 * This should only be used internally by the notification toast service.
 */
@Component({
  selector: 'sbb-simple-notification',
  templateUrl: './simple-notification.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbSimpleNotification implements SbbTextOnlyNotificationToast {
  notificationToastRef: SbbNotificationToastRef<SbbSimpleNotification> =
    inject<SbbNotificationToastRef<SbbSimpleNotification>>(SbbNotificationToastRef);

  /** Data that was injected into the notification toast. */
  data: { message: string } = inject(SBB_NOTIFICATION_TOAST_DATA);

  constructor(...args: unknown[]);
  constructor() {}

  /** Dismisses the notification toast. */
  dismiss() {
    this.notificationToastRef.dismiss();
  }
}
