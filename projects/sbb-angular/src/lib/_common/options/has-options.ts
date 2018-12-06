import { ContentChildren, QueryList } from '@angular/core';
import { OptionComponent, OptionGroupComponent } from '../../option';

export class HasOptions {

  /** All of the defined select options. */
  @ContentChildren(OptionComponent, { descendants: true }) options: QueryList<OptionComponent>;

  /** All of the defined groups of options. */
  @ContentChildren(OptionGroupComponent) optionGroups: QueryList<OptionGroupComponent>;

}
