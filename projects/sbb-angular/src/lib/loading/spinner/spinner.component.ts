import {
  Component,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  ChangeDetectionStrategy,
  ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { SbbSpinnerService } from '../service/sbb-spinner.service';


@Component({
  selector: 'sbb-spinner',
  templateUrl: 'spinner.component.html',
  styleUrls: ['spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  @Input() srAltText?: string;
  /**
   * Flag to show/hide spinner
   *
   */
  showSpinner = false;
  /**
   * Subscription variable for spinner
   *
   */
  private _spinnerSubscription: Subscription;

  /**
   * Creates an instance of SpinnerComponent.
   *
   */
  constructor(private spinnerService: SbbSpinnerService, private _changeDetector: ChangeDetectorRef) {
    this._spinnerSubscription = this.spinnerService.spinnerObservable.subscribe(flag => {
      this.showSpinner = flag;
      this._changeDetector.markForCheck();
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
    this._spinnerSubscription.unsubscribe();
  }
}
