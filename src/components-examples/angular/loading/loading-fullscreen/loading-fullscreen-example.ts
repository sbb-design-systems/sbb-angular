import { Component } from '@angular/core';

/**
 * @title Fullscreen loading
 * @order 30
 */
@Component({
  selector: 'sbb-loading-fullscreen-example',
  templateUrl: './loading-fullscreen-example.html',
})
export class LoadingFullscreenExample {
  showSpinner: boolean;

  activateSpinner() {
    this.showSpinner = true;

    setTimeout(() => (this.showSpinner = false), 3500);
  }
}
