import { Component, OnInit, Input } from '@angular/core';
import { ComponentUiService } from './services/component-ui.service';
import { Router } from '@angular/router';
import { AccordionNotificationService } from './services/accordion-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'sbb-angular-showcase';

  sizeOfUiComponents = 0;

  componentsClicked:boolean = true;
  iconsClicked: boolean = false;

  constructor(private componentUiService : ComponentUiService, private accordionNotificationService : AccordionNotificationService) {
  }

  ngOnInit() {
    this.sizeOfUiComponents = this.componentUiService.getAll().length;
    // write it out ...
    console.log('Size of UI Component', this.sizeOfUiComponents);

    this.accordionNotificationService.openComponent.subscribe(value => {
          this.componentsClicked = value;
    });

    this.accordionNotificationService.openIcon.subscribe(value => {
      this.iconsClicked = value;
    });
  }
}