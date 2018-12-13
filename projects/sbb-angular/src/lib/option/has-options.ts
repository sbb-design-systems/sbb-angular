import { QueryList } from '@angular/core';
import { OptionComponent, OptionGroupComponent } from '../option/option';

import { Constructor } from '../_common/constructor';


/** @docs-private */
export interface HasOptions {
  /** Whether the component is disabled. */
  options: QueryList<OptionComponent>;
  optionGroups: QueryList<OptionGroupComponent>;

}

/** Mixin to augment a directive with a `disabled` property. */
const mediaQueriesBreakpoints = [
  { min: 321, em: 1 },
  { min: 643, em: 1 },
  { min: 1025, em: 1 },
  { min: 2561, em: 1.5 },
  { min: 3841, em: 2 }
];

export class MediaQueryResizableComponent {

  get ems(): number {
    return this.getEmByWindowWidth();
  }

  private getEmByWindowWidth(): number {
    const windowWidth = window.innerWidth;
    const em = mediaQueriesBreakpoints.find((mediaQuery, index) => {
      if (index < mediaQueriesBreakpoints.length - 1) {
        return mediaQuery.min <= windowWidth && mediaQueriesBreakpoints[index + 1].min > windowWidth;
      } else {
        return mediaQuery.min <= windowWidth;
      }
    }).em;
    if (!em) {
      return 1;
    }
    return em;
  }

}

export abstract class OptionsChooserComponent extends MediaQueryResizableComponent {


}
