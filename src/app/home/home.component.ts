import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AccordionNotificationService } from '../services/accordion-notification.service';

@Component({
  selector: 'sbb-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private accordionNotificationService : AccordionNotificationService) {}

  ngOnInit() {
  }
  
  openComponents() {
    // write it out ...
    console.log('open components ...');
    this.accordionNotificationService.setOpenComponent(true);
  }

  openIcons() {
    // write it out ...
    console.log('open icons ...');
    this.accordionNotificationService.setOpenIcon(true);
  }

}