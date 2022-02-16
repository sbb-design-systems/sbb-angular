import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';

import { AbstractConstructor, Constructor } from './constructor';
import { CanDisable } from './disabled';

/** @docs-private */
export interface HasTabIndex {
  /** Tabindex of the component. */
  tabIndex: number;

  /** Tabindex to which to fall back to if no value is set. */
  defaultTabIndex: number;
}

/** Mixin to augment a directive with a `tabIndex` property. */
export function mixinTabIndex<T extends AbstractConstructor<CanDisable>>(
  base: T,
  defaultTabIndex?: number
): AbstractConstructor<HasTabIndex> & T;
export function mixinTabIndex<T extends Constructor<CanDisable>>(
  base: T,
  defaultTabIndex = 0
): Constructor<HasTabIndex> & T {
  return class extends base implements HasTabIndex {
    private _tabIndex: number = defaultTabIndex;
    defaultTabIndex = defaultTabIndex;

    get tabIndex(): number {
      return this.disabled ? -1 : this._tabIndex;
    }
    set tabIndex(value: NumberInput) {
      // If the specified tabIndex value is null or undefined, fall back to the default value.
      this._tabIndex = value != null ? coerceNumberProperty(value) : this.defaultTabIndex;
    }

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
