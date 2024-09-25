import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

const modeSessionStorageKey = 'sbbAngularMode';

@Component({
  selector: 'sbb-mode-notification-toast',
  template: `The app is currenly shown in the "sbb-off-brand-colors" mode.
    <button sbb-ghost-button (click)="onDisableButtonClick()">Disable mode</button>`,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .sbb-notification-toast {
        /* avoid flickering by disabling animations */
        transform: none !important;
        opacity: 1 !important;
      }
      .sbb-notification-toast-icon-wrapper {
        height: 100%;
      }
    `,
  ],
})
export class ModeNotificationToastComponent {
  constructor(private _router: Router) {}
  onDisableButtonClick() {
    sessionStorage.removeItem(modeSessionStorageKey);
    const urlTree = this._router.parseUrl(this._router.url);
    delete urlTree.queryParams.mode;
    this._router
      .navigateByUrl(urlTree, { skipLocationChange: false })
      .then(() => window.location.reload());
  }
}
