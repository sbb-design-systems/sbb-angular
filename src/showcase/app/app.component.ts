import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

import { ROUTER_ANIMATION } from './shared/animations';

const { dependencies, version } = {
  version: '0.0.0-PLACEHOLDER',
  dependencies: { '@angular/core': '^0.0.0-NG' }
};

@Component({
  selector: 'sbb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ROUTER_ANIMATION]
})
export class AppComponent {
  @HostBinding('class.menu-push') showMenu = false;
  angularVersion = dependencies['@angular/core'].replace('^', '');
  showcaseVersion = version;

  constructor(router: Router) {
    router.events.subscribe(() => (this.showMenu = false));
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}
