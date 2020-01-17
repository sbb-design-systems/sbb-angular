import { Component } from '@angular/core';

import { JUMPMARKS } from '../notification-data';

@Component({
  selector: 'sbb-jumpmark-notification',
  templateUrl: './jumpmark-notification.component.html'
})
export class JumpmarkNotificationComponent {
  jumpmarks = JUMPMARKS;
}
