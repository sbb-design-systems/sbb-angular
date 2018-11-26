import { Component, OnDestroy, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Subscription } from 'rxjs';
import { SbbSpinnerService } from '../service/sbb-spinner.service';


@Component({
  selector: 'sbb-spinner',
  templateUrl: 'spinner.component.html',
  styleUrls: ['spinner.component.css']
})
export class SpinnerComponent implements OnDestroy, OnChanges {
  /**
   * To set backdrop color('rgba(51,51,51,0.8)')
   * Only supports RGBA color format
   */
  @Input() bdColor = 'rgba(51,51,51,0.8)';
  /**
   * To set spinner size
   *
   */
  @Input() mode = 'medium';
  /**
   * Accessibility label
   *
   */
  @Input() srOnlyLabel?: string;
  /**
   * Flag to show/hide spinner
   *
   */
  showSpinner = false;
  /**
   * Subscription variable for spinner
   *
   */
  spinnerSubscription: Subscription;


  /**
   * Creates an instance of SpinnerComponent.
   *
   */
  constructor(private spinnerService: SbbSpinnerService) {
    this.spinnerSubscription = this.spinnerService.spinnerObservable.subscribe(flag => {
      this.showSpinner = flag;
    });
  }

  /**
   * On changes event for input variables
   *
   */
  ngOnChanges(changes: SimpleChanges) {
    const sizeChange: SimpleChange = changes.mode;

    if (sizeChange) {
      if (typeof sizeChange.currentValue !== 'undefined' && sizeChange.currentValue !== sizeChange.previousValue) {
        if (sizeChange.currentValue !== '') {
          this.mode = sizeChange.currentValue;
        }
      }
    }
  }

  /**
   * Component destroy event
   *
   */
  ngOnDestroy() {
    this.spinnerSubscription.unsubscribe();
  }
}
