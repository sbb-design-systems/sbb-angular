import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class SbbSpinnerService {
  /**
   * Spinner observable
   *
   */
  public spinnerObservable = new Subject<boolean>();
  /**
   * To show spinner
   *
   */
  show() {
    this.spinnerObservable.next(true);
  }
  /**
   * To hide spinner
   *
   */
  hide() {
    this.spinnerObservable.next(false);
  }
}
