import { Component } from '@angular/core';

@Component({
  selector: 'sbb-fullscreen-loading-example',
  templateUrl: './fullscreen-loading-example.component.html',
})
export class FullscreenLoadingExampleComponent {
  showSpinner: boolean;

  activateSpinner() {
    this.showSpinner = true;

    setTimeout(() => (this.showSpinner = false), 3500);
  }
}
