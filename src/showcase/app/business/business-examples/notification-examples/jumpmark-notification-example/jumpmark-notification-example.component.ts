import { Component } from '@angular/core';

@Component({
  selector: 'sbb-jumpmark-notification-example',
  templateUrl: './jumpmark-notification-example.component.html',
})
export class JumpmarkNotificationExampleComponent {
  jumpmarks = [
    { elementId: '#tip1', title: 'Tip 1' },
    { elementId: '#tip2', title: 'Tip 2' },
  ];
}
