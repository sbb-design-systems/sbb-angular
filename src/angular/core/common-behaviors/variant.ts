import { BehaviorSubject, Observable } from 'rxjs';

import { AbstractConstructor, Constructor } from './constructor';

export const ɵvariant = new BehaviorSubject<SbbVariant>('standard');

/** @docs-private */
export interface HasVariant {
  /** Observable holding current variant (`lean` or `standard`) which emits by change */
  readonly variant: Observable<SbbVariant>;
  /** Returns current active variant as a snapshot */
  readonly variantSnapshot: SbbVariant;
}

/** Possible variant values. */
export type SbbVariant = 'standard' | 'lean';

/** Mixin to augment a directive with a variant property. */
export function mixinVariant<T extends AbstractConstructor<any>>(
  base: T,
): AbstractConstructor<HasVariant> & T;
export function mixinVariant<T extends Constructor<any>>(base: T): Constructor<HasVariant> & T {
  return class extends base {
    readonly variant: Observable<SbbVariant> = ɵvariant;

    constructor(...args: any[]) {
      super(...args);
    }

    get variantSnapshot(): SbbVariant {
      return ɵvariant.value;
    }
  };
}
