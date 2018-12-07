import { ContentChildren, QueryList } from '@angular/core';
import { OptionComponent, OptionGroupComponent } from '../option/option';

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

export class OptionsChooserComponent extends MediaQueryResizableComponent {

  /** All of the defined select options. */
  @ContentChildren(OptionComponent, { descendants: true }) options: QueryList<OptionComponent>;

  /** All of the defined groups of options. */
  @ContentChildren(OptionGroupComponent) optionGroups: QueryList<OptionGroupComponent>;

}
