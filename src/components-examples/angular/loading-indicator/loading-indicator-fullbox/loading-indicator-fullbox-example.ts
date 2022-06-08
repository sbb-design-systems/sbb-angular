import { Component } from '@angular/core';

/**
 * @title Fullbox Loading
 * @order 20
 */
@Component({
  selector: 'sbb-loading-indicator-fullbox-example',
  templateUrl: 'loading-indicator-fullbox-example.html',
})
export class LoadingIndicatorFullboxExample {
  showSpinner: boolean;

  activateSpinner() {
    this.showSpinner = true;

    setTimeout(() => (this.showSpinner = false), 3500);
  }
}
