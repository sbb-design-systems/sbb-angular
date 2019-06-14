import { Component } from '@angular/core';

import { AccordionNotificationService } from '../services/accordion-notification.service';

@Component({
  selector: 'sbb-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private _accordionNotificationService: AccordionNotificationService) {}

  openComponents() {
    this._accordionNotificationService.setOpenComponent(true);
  }

  openIcons() {
    this._accordionNotificationService.setOpenIcon(true);
  }
}
