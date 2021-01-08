import { Component } from '@angular/core';

@Component({
  selector: 'sbb-fullbox-loading-example',
  templateUrl: './fullbox-loading-example.component.html',
})
export class FullboxLoadingExampleComponent {
  showSpinner: boolean;

  activateSpinner() {
    this.showSpinner = true;

    setTimeout(() => (this.showSpinner = false), 3500);
  }
}
