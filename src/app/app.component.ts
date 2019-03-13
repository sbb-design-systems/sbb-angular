import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ComponentUiService } from './services/component-ui.service';
import { AccordionNotificationService } from './services/accordion-notification.service';
import { IconUiService } from './services/icon-ui.service';
import { routeAnimation } from './shared/animations';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'sbb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    routeAnimation
  ]
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
  gettingStartedClicked: boolean;

  @ViewChild('maincontent') maincontent: ElementRef;

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

  skipLink(evt) {
    evt.preventDefault();
    this.maincontent.nativeElement.focus();
  }

  getPage(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['page'];
  }
}
