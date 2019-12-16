import { Component } from '@angular/core';
import { NotificationType } from '@sbb-esta/angular-business/notification';

import { JUMPMARKS, NOTIFICATION_TYPES } from '../notification-data';

@Component({
  selector: 'sbb-title-content-notification',
  templateUrl: './title-content-notification.component.html'
})
export class TitleContentNotificationComponent {
  type = NotificationType.SUCCESS;
  types = NOTIFICATION_TYPES.slice();
  jumpmarks = JUMPMARKS;
  message =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ' +
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ' +
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
}
