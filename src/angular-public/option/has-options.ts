import { QueryList } from '@angular/core';

import { SbbOptionGroup } from './option-group/option-group.component';
import { SbbOption } from './option/option.component';

/** @docs-private */
export interface SbbHasOptions {
  /** Whether the component is disabled. */
  options: QueryList<SbbOption>;
  optionGroups: QueryList<SbbOptionGroup>;
}

/** Mixin to augment a directive with a `disabled` property. */
const mediaQueriesBreakpoints = [
  { min: 321, em: 1 },
  { min: 643, em: 1 },
  { min: 1025, em: 1 },
  { min: 2561, em: 1.5 },
  { min: 3841, em: 2 },
];

export class SbbMediaQueryResizable {
  get ems(): number {
    return this._getEmByWindowWidth();
  }

  private _getEmByWindowWidth(): number {
    const windowWidth = window.innerWidth;
    const em = mediaQueriesBreakpoints.find((mediaQuery, index) => {
      if (index < mediaQueriesBreakpoints.length - 1) {
        return (
          mediaQuery.min <= windowWidth && mediaQueriesBreakpoints[index + 1].min > windowWidth
        );
      } else {
        return mediaQuery.min <= windowWidth;
      }
    })!.em;
    if (!em) {
      return 1;
    }
    return em;
  }
}
