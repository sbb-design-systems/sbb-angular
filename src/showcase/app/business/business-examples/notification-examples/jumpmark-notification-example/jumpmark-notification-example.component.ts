import { Component } from '@angular/core';

import { JUMPMARKS } from '../notification-data';

@Component({
  selector: 'sbb-jumpmark-notification-example',
  templateUrl: './jumpmark-notification-example.component.html'
})
export class JumpmarkNotificationExampleComponent {
  jumpmarks = JUMPMARKS;
}
