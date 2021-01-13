import { Component } from '@angular/core';

/**
 * @title Fullbox loading
 */
@Component({
  selector: 'sbb-loading-fullbox-example',
  templateUrl: './loading-fullbox-example.html',
})
export class LoadingFullboxExample {
  showSpinner: boolean;

  activateSpinner() {
    this.showSpinner = true;

    setTimeout(() => (this.showSpinner = false), 3500);
  }
}
