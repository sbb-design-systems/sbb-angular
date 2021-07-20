import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { AbstractConstructor, Constructor } from './constructor';

/** @docs-private */
export interface CanDisable {
  /** Whether the component is disabled. */
  disabled: boolean;
}

/** Mixin to augment a directive with a `disabled` property. */
export function mixinDisabled<T extends AbstractConstructor<{}>>(
  base: T
): AbstractConstructor<CanDisable> & T;
export function mixinDisabled<T extends Constructor<{}>>(base: T): Constructor<CanDisable> & T {
  return class extends base {
    private _disabled: boolean = false;

    get disabled() {
      return this._disabled;
    }
    set disabled(value: any) {
      this._disabled = coerceBooleanProperty(value);
    }

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
