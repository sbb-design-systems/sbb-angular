import { Component, HostBinding } from '@angular/core';

import { dependencies, version } from '../../../../package.json';

import { ROUTER_ANIMATION } from './shared/animations';

@Component({
  selector: 'sbb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ROUTER_ANIMATION]
})
export class AppComponent {
  @HostBinding('class.menu-push') showMenu = false;
  angularVersion = dependencies['@angular/core'].replace('^', '');
  showcaseVersion = version;

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}
