import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AccordionNotificationService } from './services/accordion-notification.service';
import { ComponentUiService } from './services/component-ui.service';
import { IconUiService } from './services/icon-ui.service';
import { ROUTER_ANIMATION } from './shared/animations';

@Component({
  selector: 'sbb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    ROUTER_ANIMATION
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

  constructor(
    private _componentUiService: ComponentUiService,
    private _iconUiService: IconUiService,
    private _accordionNotificationService: AccordionNotificationService,
  ) { }

  ngOnInit() {
    this.sizeOfUiIcons = this._iconUiService.getAll().length;
    this.sizeOfUiComponents = this._componentUiService.getAll().length;

    this._accordionNotificationService.openComponent.subscribe(value => {
      this.componentsClicked = !this.componentsClicked;
    });

    this._accordionNotificationService.openIcon.subscribe(value => {
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
