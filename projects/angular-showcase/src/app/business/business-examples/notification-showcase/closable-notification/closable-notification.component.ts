import { Component } from '@angular/core';

@Component({
  selector: 'sbb-custom-icon-notification',
  templateUrl: './closable-notification.component.html',
  styleUrls: ['./closable-notification.component.scss']
})
export class ClosableNotificationComponent {
  active: boolean = true;

  toggleVisible() {
    this.active = !this.active;
  }
}
