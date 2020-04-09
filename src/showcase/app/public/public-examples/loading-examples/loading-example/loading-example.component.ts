import { Component } from '@angular/core';

@Component({
  selector: 'sbb-loading-example',
  templateUrl: './loading-example.component.html',
  styleUrls: ['./loading-example.component.css']
})
export class LoadingExampleComponent {
  showSpinner: boolean;
  spinnerMode = '';

  constructor() {}

  activateSpinner(mode: string) {
    this.spinnerMode = mode;
    this.showSpinner = true;

    setTimeout(() => (this.showSpinner = false), 3500);
  }
}
