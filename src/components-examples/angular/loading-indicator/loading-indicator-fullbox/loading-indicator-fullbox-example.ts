import { Component } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbLoadingIndicatorModule } from '@sbb-esta/angular/loading-indicator';

/**
 * @title Fullbox Loading
 * @order 20
 */
@Component({
  selector: 'sbb-loading-indicator-fullbox-example',
  templateUrl: 'loading-indicator-fullbox-example.html',
  standalone: true,
  imports: [SbbLoadingIndicatorModule, SbbButtonModule],
})
export class LoadingIndicatorFullboxExample {
  showSpinner: boolean;

  activateSpinner() {
    this.showSpinner = true;

    setTimeout(() => (this.showSpinner = false), 3500);
  }
}
