import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * To modify the labels and text displayed, create a new instance of SbbSortHeaderIntl and
 * include it in a custom provider.
 */
@Injectable({ providedIn: 'root' })
export class SbbSortHeaderIntl {
  /**
   * Stream that emits whenever the labels here are changed. Use this to notify
   * components if the labels have changed after initialization.
   */
  readonly changes: Subject<void> = new Subject<void>();

  /** ARIA label for the sorting button. */
  sortButtonLabel = (id: string) => {
    return `Change sorting for ${id}`;
  };
}

export function SBB_SORT_HEADER_INTL_PROVIDER_FACTORY(parentIntl: SbbSortHeaderIntl) {
  return parentIntl || new SbbSortHeaderIntl();
}

export const SBB_SORT_HEADER_INTL_PROVIDER = {
  // If there is already an SbbSortHeaderIntl available, use that. Otherwise, provide a new one.
  provide: SbbSortHeaderIntl,
  deps: [[new Optional(), new SkipSelf(), SbbSortHeaderIntl]],
  useFactory: SBB_SORT_HEADER_INTL_PROVIDER_FACTORY
};
