import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

import { ROUTER_ANIMATION } from './shared/animations';
// @ts-ignore versions.ts is generated automatically by bazel
import { angularVersion, libraryVersion } from './versions';

@Component({
  selector: 'sbb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ROUTER_ANIMATION],
})
export class AppComponent {
  @HostBinding('class.menu-push') showMenu = false;
  angularVersion = angularVersion;
  showcaseVersion = libraryVersion;

  constructor(router: Router) {
    router.events.subscribe(() => (this.showMenu = false));
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}
