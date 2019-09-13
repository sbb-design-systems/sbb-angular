import { Component } from '@angular/core';

@Component({
  selector: 'sbb-loading-showcase',
  templateUrl: './loading-showcase.component.html',
  styleUrls: ['./loading-showcase.component.scss']
})
export class LoadingShowcaseComponent {
  showSpinner: boolean;
  spinnerMode = '';

  constructor() {}

  activateSpinner(mode: string) {
    this.spinnerMode = mode;
    this.showSpinner = true;

    setTimeout(() => (this.showSpinner = false), 3500);
  }
}
