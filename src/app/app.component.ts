import { Component, OnInit } from '@angular/core';
import { ComponentUiService } from './services/component-ui.service';
import { AccordionNotificationService } from './services/accordion-notification.service';
import { IconUiService } from './services/icon-ui.service';

@Component({
  selector: 'sbb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'sbb-angular-showcase';

  sizeOfUiComponents = 0;
  sizeOfUiIcons = 0;

  componentsClicked = true;
  iconsClicked = false;
  aboutClicked: boolean;
  versionClicked: boolean;
  isSourceTabClicked: boolean;

  constructor(private componentUiService : ComponentUiService,
              private iconUiService : IconUiService,
              private accordionNotificationService : AccordionNotificationService) {
  }

  ngOnInit() {
    this.sizeOfUiIcons = this.iconUiService.getAll().length;
    this.sizeOfUiComponents = this.componentUiService.getAll().length;

    this.accordionNotificationService.openComponent.subscribe(value => {
          this.componentsClicked = !this.componentsClicked;
    });

    this.accordionNotificationService.openIcon.subscribe(value => {
      this.iconsClicked = !this.iconsClicked;
    });
  }
}
