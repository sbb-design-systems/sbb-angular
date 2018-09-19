import { Component, OnInit } from '@angular/core';
import { ComponentUiService } from './services/component-ui.service';
import { AccordionNotificationService } from './services/accordion-notification.service';

@Component({
  selector: 'sbb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'sbb-angular-showcase';

  sizeOfUiComponents = 0;

  componentsClicked = true;
  iconsClicked = false;

  constructor(private componentUiService : ComponentUiService, private accordionNotificationService : AccordionNotificationService) {
  }

  ngOnInit() {
    this.sizeOfUiComponents = this.componentUiService.getAll().length;
    // write it out ...
    console.log('Size of UI Component', this.sizeOfUiComponents);

    this.accordionNotificationService.openComponent.subscribe(value => {
          this.componentsClicked = !this.componentsClicked;
    });

    this.accordionNotificationService.openIcon.subscribe(value => {
      this.iconsClicked = !this.iconsClicked;
    });
  }
}
