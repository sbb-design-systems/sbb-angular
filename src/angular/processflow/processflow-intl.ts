import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs';

/** Stepper data that is required for internationalization. */
@Injectable({ providedIn: 'root' })
export class SbbProcessflowIntl {
  /**
   * Stream that emits whenever the labels here are changed. Use this to notify
   * components if the labels have changed after initialization.
   */
  readonly changes: Subject<void> = new Subject<void>();

  /** Label that is rendered below optional steps. */
  optionalLabel: string = 'Optional';
}

/** @docs-private */
/* tslint:disable */
export function MAT_STEPPER_INTL_PROVIDER_FACTORY(parentIntl: SbbProcessflowIntl) {
  return parentIntl || new SbbProcessflowIntl();
}

/** @docs-private */
export const MAT_STEPPER_INTL_PROVIDER = {
  provide: SbbProcessflowIntl,
  deps: [[new Optional(), new SkipSelf(), SbbProcessflowIntl]],
  useFactory: MAT_STEPPER_INTL_PROVIDER_FACTORY,
};
