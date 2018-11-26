import { Component } from '@angular/core';
import { SbbSpinnerService } from 'sbb-angular';

@Component({
  selector: 'sbb-loading-showcase',
  templateUrl: './loading-showcase.component.html',
  styleUrls: ['./loading-showcase.component.scss']
})
export class LoadingShowcaseComponent {

  constructor(private spinner: SbbSpinnerService) {}

  activateSpinner() {
    /** spinner starts */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 3000);
  }
}

